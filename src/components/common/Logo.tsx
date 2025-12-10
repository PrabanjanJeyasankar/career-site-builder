import Image from 'next/image'

interface LogoProps {
  altText?: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export default function Logo({
  altText = 'Company Logo',
  className,
  size = 'md',
}: LogoProps) {
  const dimensions = {
    sm: 32,
    md: 150,
    lg: 200,
  }

  const dim = dimensions[size]

  return (
    <div className={className}>
      <Image src='/logo.png' alt={altText} width={dim} height={dim} priority />
    </div>
  )
}

export { Logo }
