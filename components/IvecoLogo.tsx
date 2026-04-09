interface IvecoLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

const sizeMap = {
  sm: { text: 'text-xl', tag: 'text-[10px]' },
  md: { text: 'text-2xl', tag: 'text-xs' },
  lg: { text: 'text-4xl', tag: 'text-sm' },
};

export default function IvecoLogo({ size = 'md', showTagline = false }: IvecoLogoProps) {
  const { text, tag } = sizeMap[size];
  return (
    <div className="flex flex-col gap-0.5">
      <span className={`font-black tracking-[0.18em] text-white select-none ${text}`}>
        IV
        <span className="inline-block bg-[#1654FF] px-[3px] leading-none text-white">E</span>
        CO
      </span>
      {showTagline && (
        <span className={`font-medium tracking-[0.25em] text-[#555562] uppercase ${tag}`}>
          Hub CSDT
        </span>
      )}
    </div>
  );
}
