import Image from 'next/image'

interface LogoProps {
  altText?: string
  className?: string
}

export default function Logo({
  altText = 'Company Logo',
  className,
}: LogoProps) {
  return (
    <div className={className}>
      <Image src='/logo.png' alt={altText} width={150} height={150} priority />
    </div>
  )
}
