import Header from './Header';
import Text from './Text';

export default function BrandHeader() {
  return (
    <>
      <Header h={1} center className='-mb-2 select-none text-7xl'>
        Art Share*
      </Header>
      <Text center className='ml-28 select-none' color='$gray800'>
        * working title
      </Text>
    </>
  );
}
