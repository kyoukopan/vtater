import Text from "./Text";

export default function BrandHeader() {
  return (
    <>
      <Text
        h1
        center
        className="-mb-3 select-none"
        css={{
          textGradient: "100deg, $purple500 30%, $pink500 90%",
        }}
      >
        Art Share*
      </Text>
      <Text center className="ml-28 select-none" color="$gray800">
        * working title
      </Text>
    </>
  );
}
