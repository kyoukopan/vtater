import React, { useEffect, useState } from 'react';
import {
  Badge,
  Card,
  Container,
  Loading,
  Modal,
  Switch,
  Tooltip,
} from '@nextui-org/react';
import BrandHeader from '@/components/lib/BrandHeader';
import AuthWrapper from '@/components/Auth/AuthWrapper';
import Text from '@/components/lib/Text';
import {
  useAuthState,
  useSendEmailVerification,
} from 'react-firebase-hooks/auth';
import { useDocument, useDocumentData } from 'react-firebase-hooks/firestore';
import {
  doc,
  DocumentData,
  DocumentReference,
  getDoc,
  updateDoc,
} from 'firebase/firestore';
import { auth, db, storage } from '@/lib/common/firebase';
import NavbarWrapper from '@/components/NavbarWrapper';
import { FieldRow } from '@/components/lib/Field';
import { User } from 'firebase/auth';
import Button, { IconButton } from '@/components/lib/Button';
import { toast } from 'react-toastify';
import { faPen, faSun } from '@fortawesome/free-solid-svg-icons';
import { useUploadFile } from 'react-firebase-hooks/storage';
import { ref } from 'firebase/storage';
import { useRouter } from 'next/router';
import Input from '@/components/lib/Input';
import Avatar from '@/components/lib/Avatar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function EmailWithVerification({
  user: { email, emailVerified = false },
}: {
  user: User;
}) {
  return (
    <div>
      <Badge
        variant='flat'
        color={emailVerified ? 'success' : 'default'}
        content={emailVerified ? 'verified' : 'unverified'}
        size='xs'
        className='max-w-full'
        horizontalOffset={-8}
        verticalOffset={2}
      >
        <Text inline ellipsis>
          {email}
        </Text>
      </Badge>
    </div>
  );
}

function WelcomeModal({
  visible,
  onClose,
  updateUsernameInDb,
}: {
  visible: boolean;
  onClose: () => void;
  updateUsernameInDb: Function;
}) {
  const [displayName, setDisplayName] = useState('');

  async function handleSubmit() {
    if (!displayName) return;
    try {
      await updateUsernameInDb(displayName);
    } catch {
      toast.error('Could not update profile, try again later');
      return;
    }
    onClose();
  }
  return (
    <Modal open={visible} preventClose blur>
      <Modal.Header justify='flex-start'>
        <Text h3>Welcome!</Text>
      </Modal.Header>
      <Modal.Body className='h-40'>
        <Text h4 weight='normal' className='mb-4'>
          set your display name...
        </Text>
        <Input
          clearable
          placeholder='username'
          fullWidth
          css={{ marginBottom: '$4' }}
          value={displayName}
          onChange={(e) => setDisplayName(e.target?.value)}
        />
        <Text>don't worry if someone's taken it already</Text>
      </Modal.Body>
      <Modal.Footer justify='flex-start'>
        <Button wide disabled={!displayName} onPress={handleSubmit}>
          done
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default function Profile() {
  const [user] = useAuthState(auth);
  const [verifySent, setVerifySent] = useState(false);
  const [sendEmailVerification, sending] = useSendEmailVerification(auth);
  const [editing, setEditing] = useState(false);
  const [uploadAvatarVisible, setUploadAvatarVisible] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewSrc, setPreviewSrc] = useState('');
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(Symbol());

  const [docRef, setDocRef] = useState<DocumentReference>();
  const [ageRange, setAgeRange] = useState('');
  const [birthWeek, setBirthWeek] = useState('');
  const [pronouns, setPronouns] = useState('');
  const [theme, setTheme] = useState('light');
  const [displayName, setDisplayName] = useState('');

  const [uploadFile, uploading] = useUploadFile();

  const router = useRouter();
  const [showWelcome, setShowWelcome] = useState(
    router.query.welcome === 'true'
  );
  useEffect(() => {
    async function run() {
      if (!user) {
        return;
      }
      setLoading(true);
      const ref = doc(db, 'users', user.uid);
      setDocRef(ref);
      const resp = await getDoc(ref);
      if (!resp.exists()) {
        return;
      }
      const data = resp.data();
      setAgeRange(data?.ageRange || '');
      setBirthWeek(data?.birthWeek || '');
      setPronouns(data?.pronouns || '');
      setTheme(data?.config?.theme || 'light');
      setDisplayName(data?.displayName || '');
      setLoading(false);
    }
    run();
  }, [user, refresh]);
  useEffect(() => {
    async function tryUpdate() {
      if (!docRef) return;
      setLoading(true);
      const data = {
        pronouns,
        birthWeek,
        ageRange,
      };
      await updateDoc(docRef, data);
      setRefresh(Symbol());
      setLoading(false);
    }
    editing === false && tryUpdate();
  }, [editing]);

  useEffect(() => {
    if (file == null) {
      setPreviewSrc('');
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewSrc(url);
    // eslint-disable-next-line consistent-return
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  function handleUpload() {
    if (!file || !docRef) return;
    const storageRef = ref(
      storage,
      `users/avatars/${user?.email}--${file.name}`
    );
    uploadFile(storageRef, file)
      .then((result) => {
        if (!result?.ref) {
          toast.error('Unable to update avatar. Please try again later');
          setUploadAvatarVisible(false);
          setFile(null);
          return;
        }
        updateDoc(docRef, {
          avatarURL: `http://localhost:9199/${result.ref.bucket}/${result.ref?.fullPath}`,
        }).then(() => {
          toast.success("Updated avatar. Lookin' good 😏");
          setPreviewSrc(
            `http://localhost:9199/${result.ref.bucket}/${result.ref?.fullPath}`
          );
          setUploadAvatarVisible(false);
          setFile(null);
          setRefresh(Symbol());
        });
      })
      .catch(() => {
        toast.error('Unable to update avatar. Please try again later');
      });
  }

  function handleSendVerify() {
    sendEmailVerification()
      .then((success) => {
        if (!success) {
          toast.error('Unable to send. Please try again later');
          return;
        }
        toast.success('Verification email sent!');
        setVerifySent(true);
      })
      .catch(() => {
        toast.error('Unable to send. Please try again later');
      });
  }

  function toggleDarkMode() {
    if (!docRef) return;
    void updateDoc(docRef, {
      config: { theme: theme === 'light' ? 'dark' : 'light' },
    });
    setTheme('dark');
  }
  return (
    <AuthWrapper>
      <NavbarWrapper>
        {user && (
          <WelcomeModal
            visible={showWelcome && !displayName}
            onClose={() => setShowWelcome(false)}
            updateUsernameInDb={async (displayName: string) => {
              if (!docRef) return false;
              await updateDoc(docRef, { displayName });
              return true;
            }}
          />
        )}
        <Container xs as='main' className='mt-32'>
          <div className='relative'>
            <Card variant='bordered' className='my-8 space-y-2 py-8 px-8'>
              <div>
                <div className='relative max-w-fit'>
                  <Avatar
                    customSrc={previewSrc}
                    editButton
                    onPress={() => setUploadAvatarVisible(true)}
                    uid={user?.uid}
                  />
                </div>
                <Text h2 inline className='mb-4'>
                  your account{displayName && `, ${displayName}`}.
                </Text>
              </div>
              <div className='space-y-1'>
                <Text h4>important stuff...</Text>
                <FieldRow label='display name' content={user?.displayName} />
                <FieldRow
                  label='email'
                  content={
                    user?.email ? <EmailWithVerification user={user} /> : null
                  }
                />
                {!user?.emailVerified && (
                  <div>
                    <Button
                      bordered
                      loading={sending}
                      disabled={verifySent}
                      flat
                      wide
                      className='mt-6'
                      onPress={() => handleSendVerify()}
                    >
                      {!verifySent
                        ? 'verify your email for full access'
                        : 'verification sent'}
                    </Button>
                  </div>
                )}
              </div>
              {loading ? (
                <Loading />
              ) : (
                <div className='space-y-1'>
                  <Text h4 className='mt-4'>
                    personal stuff...
                  </Text>
                  {editing ? (
                    <Input
                      fullWidth
                      placeholder='age range'
                      value={ageRange}
                      onChange={({ target: { value } }) => setAgeRange(value)}
                    />
                  ) : (
                    <FieldRow label='age range' content={ageRange} />
                  )}
                  {editing ? (
                    <Input
                      fullWidth
                      placeholder='birth week'
                      value={birthWeek}
                      onChange={({ target: { value } }) => setBirthWeek(value)}
                    />
                  ) : (
                    <FieldRow label='birth week' content={birthWeek} />
                  )}
                  {editing ? (
                    <Input
                      fullWidth
                      placeholder='pronoun(s)'
                      value={pronouns}
                      onChange={({ target: { value } }) => setPronouns(value)}
                    />
                  ) : (
                    <FieldRow label='pronoun(s)' content={pronouns} />
                  )}
                </div>
              )}
              <div className='space-y-1'>
                <Text h4 className='mt-4'>
                  customization...
                </Text>
                <FieldRow
                  label='dark mode'
                  content={
                    <Switch
                      checked={theme === 'dark'}
                      onChange={toggleDarkMode}
                      color='default'
                      iconOn={<FontAwesomeIcon icon={faSun} />}
                    />
                  }
                />
              </div>
            </Card>
            <Tooltip
              isDisabled={!editing}
              visible={editing}
              trigger='click'
              keepMounted
              className='absolute -top-2 -right-2'
              content={
                <span>
                  you're in edit mode!
                  <br />
                  click again to save
                </span>
              }
            >
              <IconButton
                size={64}
                type='button'
                color={editing ? 'error' : 'default'}
                icon={faPen}
                onPress={() => setEditing((val) => !val)}
              />
            </Tooltip>
          </div>
        </Container>
        <Modal
          open={uploadAvatarVisible}
          onClose={() => setUploadAvatarVisible(false)}
          blur
        >
          <Modal.Header justify='flex-start'>
            <Text h3>change avatar</Text>
          </Modal.Header>
          <Modal.Body className='h-48'>
            <div className='flex items-center'>
              <Avatar
                // @ts-ignore
                size='huge'
                className='pointer-events-none mr-8 flex-shrink-0'
                customSrc={previewSrc}
                uid={user?.uid}
              />
              <Text h4 weight='normal'>
                {!user?.photoURL
                  ? "Tired of being letters? We don't blame you."
                  : 'Time to change your look?'}
              </Text>
            </div>
          </Modal.Body>
          <Modal.Footer justify='flex-start'>
            <label
              htmlFor='avatar-file-input'
              className='absolute h-[40px] w-[360px] cursor-pointer'
            >
              <input
                id='avatar-file-input'
                aria-label='select-avatar-image'
                style={{
                  display: 'none',
                }}
                type='file'
                onChange={(e) => {
                  if (e.target?.files) setFile(e.target?.files[0]);
                }}
                accept='.jpg, .jpeg, .png'
              />
            </label>
            <Button
              wide
              bordered={!file}
              className={!file ? 'pointer-events-none' : ''}
              onPress={() => handleUpload()}
              loading={uploading}
            >
              {file ? 'save image' : 'select file'}
            </Button>
          </Modal.Footer>
        </Modal>
      </NavbarWrapper>
    </AuthWrapper>
  );
}
