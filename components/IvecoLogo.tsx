import Image from 'next/image';

interface IvecoLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

const sizeMap = {
  sm: { width: 80, height: 28 },
  md: { width: 150, height: 52 },
  lg: { width: 200, height: 70 },
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
        <span className="font-bold tracking-[0.25em] text-[#9999b8] uppercase text-sm">
          Hub CSDT
        </span>
      )}
    </div>
  );
}
