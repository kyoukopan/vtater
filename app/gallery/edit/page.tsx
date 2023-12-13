'use client';
import AuthWrapper from '@/components/Auth/AuthWrapper';
import NavbarWrapper from '@/components/NavbarWrapper';
import Button from '@/components/lib/Button';
import Header from '@/components/lib/Header';
import { db } from '@/lib/common/firebase';
import useCurrentUser from '@/lib/hooks/useCurrentUser';
import { useUpdateUserGallery } from '@/lib/hooks/useUser';
import { Image, Switch } from '@nextui-org/react';
import { doc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

function LayoutConfig({ userData, userDataLoading, user, setStep }: any) {
  const [imageSrc, setImageSrc] = useState(
    'https://images.unsplash.com/photo-1469598614039-ccfeb0a21111?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80'
  );
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
        <Header h={5} inline className='ml-2'>
          {fullWidth ? 'Full-width' : 'Grid'}
        </Header>
      </div>
      <div className='mb-4 mt-16 flex gap-8'>
        <Header h={3} inline>
          preview:
        </Header>
        <Button onPress={confirmLayout}>continue</Button>
      </div>
      {imageSrc && <p>aaaaaaa</p>}
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
        variant={!file ? 'bordered' : undefined}
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
        <main className='mt-32'>
          <Header h={2}>
            {step === 1
              ? 'step 1: customize your gallery layout'
              : 'step 2: upload'}
          </Header>
          {step === 1 && (
            <LayoutConfig
              userData={userData}
              userDataLoading={userDataLoading}
              user={user}
              setStep={setStep}
            />
          )}
          {step === 2 && <UploadImages />}
        </main>
      </NavbarWrapper>
    </AuthWrapper>
  );
}
