import React, { useCallback, useEffect, useRef, useState } from 'react';

import {
  Avatar,
  Badge,
  Card,
  Container,
  Grid,
  Image,
  Loading,
  Modal,
  Switch,
} from '@nextui-org/react';
import BrandHeader from '@/components/lib/BrandHeader';
import AuthWrapper from '@/components/Auth/AuthWrapper';
import Text from '@/components/lib/Text';
import {
  useAuthState,
  useSendEmailVerification,
  useUpdateProfile,
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
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { useUploadFile } from 'react-firebase-hooks/storage';
import { ref } from 'firebase/storage';
import { useRouter } from 'next/router';
import Input from '@/components/lib/Input';
import { deepEqual } from 'assert';
import { useQuery } from 'react-query';
import axios from 'axios';
import useCurrentUser from '@/lib/hooks/useCurrentUser';
import { useUpdateUserGallery } from '@/lib/hooks/useUser';

function LayoutConfig({ userData, userDataLoading, user, setStep }: any) {
  const [imageSrc, setImageSrc] = useState('');
  useEffect(() => {
    async function run() {
      try {
        const response = await fetch('http://localhost:4200/random_image_url');
        if (response.status === 500) {
          return;
        }
        const data = await response.json();
        setImageSrc(data?.imageUrl);
        console.log(data);
      } catch {
        return;
      }
    }
    run();
  }, []);
  const [fullWidth, setFullWidth] = useState(
    userData?.gallery?.layout === 'full-width' ? true : false
  );

  useEffect(() => {
    if (userDataLoading) return;
    if (userData?.gallery?.layout === 'full-width') {
      setFullWidth(true);
    }
  }, [userDataLoading]);

  async function confirmLayout() {
    if (!user || userDataLoading) return;
    const docRef = doc(db, 'users', user.uid);
    try {
      await updateDoc(docRef, {
        gallery: {
          ...userData?.gallery,
          layout: fullWidth ? 'full-width' : 'grid',
        },
      });
    } catch {
      return;
    }
    setStep(2);
    return;
  }
  return (
    <>
      <div className='flex items-center'>
        <Switch
          checked={fullWidth}
          onChange={(e) => setFullWidth(e.target.checked)}
        />
        <Text h5 inline className='ml-2'>
          {fullWidth ? 'Full-width' : 'Grid'}
        </Text>
      </div>
      <div className='mb-4 mt-16 flex gap-8'>
        <Text h3 inline>
          preview:
        </Text>
        <Button onPress={confirmLayout}>continue</Button>
      </div>
      {imageSrc && (
        <Grid.Container gap={2} justify='center'>
          <Grid xs={fullWidth ? 12 : 4}>
            <Image src={imageSrc} alt='sample image' />
          </Grid>
          <Grid xs={fullWidth ? 12 : 4}>
            <Image src={imageSrc} alt='sample image' />
          </Grid>
          <Grid xs={fullWidth ? 12 : 4}>
            <Image src={imageSrc} alt='sample image' />
          </Grid>
          <Grid xs={fullWidth ? 12 : 4}>
            <Image src={imageSrc} alt='sample image' />
          </Grid>
          <Grid xs={fullWidth ? 12 : 4}>
            <Image src={imageSrc} alt='sample image' />
          </Grid>
          <Grid xs={fullWidth ? 12 : 4}>
            <Image src={imageSrc} alt='sample image' />
          </Grid>
        </Grid.Container>
      )}
    </>
  );
}

function UploadImages() {
  const [file, setFile] = useState<File | null>(null);
  const [previewSrc, setPreviewSrc] = useState('');
  const { uploadFile, updating, loading } = useUpdateUserGallery();
  const router = useRouter();

  async function handleUpload() {
    const url = await uploadFile(file);
    router.push('/profile');
  }

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

  return (
    <div className='mt-8'>
      <label
        htmlFor='avatar-file-input'
        className='absolute h-[40px] w-full cursor-pointer'
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
        loading={updating || loading}
      >
        {file ? 'save image' : 'select file'}
      </Button>
      <div className='h-52 w-full'>
        {previewSrc && <Image src={previewSrc} />}
      </div>
    </div>
  );
}

export default function EditGallery() {
  const { userData, userDataLoading } = useCurrentUser();

  const [step, setStep] = useState(1);
  const { user } = useCurrentUser();

  return (
    <AuthWrapper>
      <NavbarWrapper>
        <Container sm as='main' className='mt-32'>
          <Text h2>
            {step === 1
              ? 'step 1: customize your gallery layout'
              : 'step 2: upload'}
          </Text>
          {step === 1 && (
            <LayoutConfig
              userData={userData}
              userDataLoading={userDataLoading}
              user={user}
              setStep={setStep}
            />
          )}
          {step === 2 && <UploadImages />}
        </Container>
      </NavbarWrapper>
    </AuthWrapper>
  );
}
