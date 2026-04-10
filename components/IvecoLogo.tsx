import Image from 'next/image';

interface IvecoLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

const sizeMap = {
  sm: { width: 80, height: 28 },
  md: { width: 110, height: 38 },
  lg: { width: 160, height: 56 },
};

export default function IvecoLogo({ size = 'md', showTagline = false }: IvecoLogoProps) {
  const { width, height } = sizeMap[size];
  return (
    <div className="flex flex-col gap-1">
      <Image
        src="/logo-iveco.png"
        alt="IVECO"
        width={width}
        height={height}
        priority
        className="object-contain"
      />
      {showTagline && (
        <span className="font-medium tracking-[0.25em] text-[#555562] uppercase text-xs">
          Hub CSDT
        </span>
      )}
    </div>
  );
}
