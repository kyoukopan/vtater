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

export default function Gallery() {
  const [imageSrc, setImageSrc] = useState(null);
  const [fullWidth, setFullWidth] = useState(false);

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

  return (
    <AuthWrapper>
      <NavbarWrapper>
        <Container xs as='main' className='mt-32'>
          <Text h2>customize your gallery layout</Text>
          <div className='flex items-center'>
            <Switch onChange={(e) => setFullWidth(e.target.checked)} />
            <Text h5 inline className='ml-2'>
              {fullWidth ? 'Full-width' : 'Grid'}
            </Text>
          </div>
          <Card variant='bordered' className='my-8 space-y-2 py-8 px-8'>
            <div>
              <Text h3 inline className='mb-4'>
                preview:
              </Text>
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
          </Card>
        </Container>
      </NavbarWrapper>
    </AuthWrapper>
  );
}
