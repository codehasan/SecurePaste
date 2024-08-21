import blockies from 'ethereum-blockies';
import Image, { ImageProps } from 'next/image';

interface IconProps {
  address: string;
  size: number;
  scale: number;
  bgcolor?: string;
  color?: string;
  spotcolor?: number;
}

const WalletBlockIcon = ({
  address,
  size,
  scale,
  bgcolor,
  color,
  spotcolor,
  ...props
}: IconProps & Omit<ImageProps, 'src' | 'alt'>) => {
  const iconSrc = blockies
    .create({
      seed: address.toLowerCase(),
      size: size,
      scale: scale,
      bgcolor: bgcolor,
      color: color,
      spotcolor: spotcolor,
    })
    .toDataURL();

  return <Image src={iconSrc} alt="Wallet Icon" {...props} />;
};

export default WalletBlockIcon;
