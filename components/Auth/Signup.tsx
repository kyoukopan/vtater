import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react';
import axios from 'axios';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { ChangeEvent, FormEvent, useState } from 'react';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';

import { auth } from '@/lib/common/firebase';

import Button from '../lib/Button';
import Header from '../lib/Header';
import Input from '../lib/Input';

interface SignupProps {
  /** Is the signup modal visible? */
  open: boolean;
  /** Called in order to close the modal */
  onOpenChange: () => void;
}
export default function SignupModal({ open, onOpenChange }: SignupProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const router = useRouter();
  const signup = useMutation(
    (userData: { email: string; password: string }) =>
      axios.post('/api/users/signup', userData),
    {
      async onSuccess() {
        toast.success('Welcome!');
        await signInWithEmailAndPassword(auth, email, password);
        router.replace('/account?welcome=true');
      },
      onError() {
        toast.error('Unable to sign up. Please try again.');
        setPassword('');
        setPasswordConfirm('');
      },
    },
  );

  const passwordFieldsValid = Boolean(
    password && passwordConfirm && password === passwordConfirm,
  );
  const canSubmit = email && passwordFieldsValid;

  const handleChangeValue = (
    e: ChangeEvent<HTMLInputElement>,
    field: string,
  ) => {
    let set = setEmail;
    switch (field) {
      case 'password':
        set = setPassword;
        break;
      case 'passwordConfirm':
        set = setPasswordConfirm;
        break;
      default:
        break;
    }
    set(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<unknown>) => {
    e.preventDefault();
    if (!canSubmit) return;
    signup.mutate({ email, password });
  };

  const showPasswordDoesNotMatchHint = Boolean(
    email && password && passwordConfirm && !passwordFieldsValid,
  );

  return (
    <Modal
      closeButton
      backdrop='blur'
      isOpen={open}
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <form
            onSubmit={(e) => {
              onClose();
              handleSubmit(e);
            }}
          >
            <ModalHeader className='justify-start'>
              <Header h={3}>sign up</Header>
            </ModalHeader>
            <ModalBody className='space-y-8'>
              <Input
                required
                value={email}
                onChange={(e) => handleChangeValue(e, 'email')}
                aria-label='email'
                placeholder='email'
                type='email'
                loading={signup.isLoading}
              />
              <div>
                <Input
                  required
                  value={password}
                  valid={passwordFieldsValid}
                  validateNow={showPasswordDoesNotMatchHint}
                  onChange={(e) => handleChangeValue(e, 'password')}
                  password
                  side='top'
                  aria-label='password'
                  placeholder='password'
                  fullWidth
                  loading={signup.isLoading}
                />
                <Input
                  required
                  value={passwordConfirm}
                  valid={passwordFieldsValid}
                  validateNow={showPasswordDoesNotMatchHint}
                  hint={
                    showPasswordDoesNotMatchHint
                      ? 'Password confirmation does not match'
                      : undefined
                  }
                  onChange={(e) => handleChangeValue(e, 'passwordConfirm')}
                  password
                  side='bottom'
                  aria-label='password-confirmation'
                  placeholder='confirm password'
                  className='mt-[3px]'
                  fullWidth
                  loading={signup.isLoading}
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                loading={signup.isLoading}
                size='sm'
                type='submit'
                disabled={!canSubmit}
              >
                submit
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
}
