'use client';
import AuthWrapper from '@/components/Auth/AuthWrapper';
import NavbarWrapper from '@/components/NavbarWrapper';
import Avatar from '@/components/lib/Avatar';
import Button, { IconButton } from '@/components/lib/Button';
import { FieldRow } from '@/components/lib/Field';
import Header from '@/components/lib/Header';
import Input from '@/components/lib/Input';
import Text from '@/components/lib/Text';
import { auth, db, storage } from '@/lib/common/firebase';
import { faPen, faSun } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Badge,
  Card,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner,
  Switch,
  Tooltip,
} from '@nextui-org/react';
import { User } from 'firebase/auth';
import { DocumentReference, doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref } from 'firebase/storage';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {
  useAuthState,
  useSendEmailVerification,
} from 'react-firebase-hooks/auth';
import { useUploadFile } from 'react-firebase-hooks/storage';
import { toast } from 'react-toastify';

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
        size='sm'
        className='max-w-full'
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
    <Modal isOpen={visible} isDismissable={false} backdrop='blur'>
      <ModalHeader className='justify-start'>
        <Header h={3}>Welcome!</Header>
      </ModalHeader>
      <ModalBody className='h-50'>
        <Text>
          <strong>ArtShare</strong> is a community for sharing your work and
          building a community.
        </Text>
        <Header h={4} className='mb-4 mt-4 font-normal'>
          first, set your display name...
        </Header>
        <Input
          isClearable
          placeholder='username'
          fullWidth
          style={{ marginBottom: '$4' }}
          value={displayName}
          onChange={(e) => setDisplayName(e.target?.value)}
        />
        <Text>don't worry if someone's taken it already</Text>
      </ModalBody>
      <ModalFooter className='justify-start'>
        <Button wide disabled={!displayName} onPress={handleSubmit}>
          done
        </Button>
      </ModalFooter>
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
        <main className='mt-12 mb-20'>
          {router?.query?.welcome === 'true' && (
            <div className='space-y-4'>
              <Text>
                <span className='text-lg'>👋</span> Welcome to the community! To
                start, why don't you share some info about yourself and
                customize your account a bit?
              </Text>
              <Text>
                Don't worry - you don't have to share more than you're
                comfortable with. Or, head over to your{' '}
                <a href='/profile'>profile</a> and start uploading!
              </Text>
            </div>
          )}
          <div className='relative'>
            <Card shadow='none' className='my-8 space-y-2 py-8 px-8'>
              <div>
                <div className='relative max-w-fit'>
                  <Avatar
                    customSrc={previewSrc}
                    editButton
                    onPress={() => setUploadAvatarVisible(true)}
                    uid={user?.uid}
                  />
                </div>
                <Header h={2} inline className='mb-4'>
                  your account{displayName && `, ${displayName}`}.
                </Header>
              </div>
              <div className='space-y-1'>
                <Header h={4}>important stuff...</Header>
                <FieldRow label='display name' content={displayName} />
                <FieldRow
                  label='email'
                  content={
                    user?.email ? <EmailWithVerification user={user} /> : null
                  }
                />
                {!user?.emailVerified && (
                  <div>
                    <Button
                      variant='bordered'
                      loading={sending}
                      disabled={verifySent}
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
                <Spinner />
              ) : (
                <div className='space-y-1'>
                  <Header h={4} className='mt-4'>
                    personal stuff...
                  </Header>
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
                <Header h={4} className='mt-4'>
                  customization...
                </Header>
                <FieldRow
                  label='dark mode'
                  content={
                    <Switch
                      checked={theme === 'dark'}
                      onChange={toggleDarkMode}
                      color='default'
                      thumbIcon={({ isSelected, className }) =>
                        isSelected ? (
                          <FontAwesomeIcon icon={faSun} />
                        ) : undefined
                      }
                    />
                  }
                />
              </div>
            </Card>

            <Tooltip
              isDisabled={!editing}
              isOpen={editing}
              className='absolute -top-2 -right-2'
              content={
                <span>
                  you're in edit mode!
                  <br />
                  click again to save
                </span>
              }
            >
              <Tooltip
                isOpen={router.query?.welcome === 'true'}
                content='click me to edit!'
                style={{ zIndex: 100 }}
              >
                <IconButton
                  size={64}
                  type='button'
                  color={editing ? 'warning' : 'default'}
                  icon={faPen}
                  onPress={() => setEditing((val) => !val)}
                />
              </Tooltip>
            </Tooltip>
          </div>
        </main>
        <Modal
          isOpen={uploadAvatarVisible}
          onClose={() => setUploadAvatarVisible(false)}
          backdrop='blur'
        >
          <ModalHeader className='justify-start'>
            <Header h={3}>change avatar</Header>
          </ModalHeader>
          <ModalBody className='h-48'>
            <div className='flex items-center'>
              <Avatar
                // @ts-ignore
                size='huge'
                className='pointer-events-none mr-8 flex-shrink-0'
                customSrc={previewSrc}
                uid={user?.uid}
              />
              <Header h={4} className='font-normal'>
                {!user?.photoURL
                  ? "Tired of being letters? We don't blame you."
                  : 'Time to change your look?'}
              </Header>
            </div>
          </ModalBody>
          <ModalFooter className='justify-start'>
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
              variant={!file ? 'bordered' : undefined}
              className={!file ? 'pointer-events-none' : ''}
              onPress={() => handleUpload()}
              loading={uploading}
            >
              {file ? 'save image' : 'select file'}
            </Button>
          </ModalFooter>
        </Modal>
      </NavbarWrapper>
    </AuthWrapper>
  );
}
