"use client"
import React from 'react'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface PageHeaderProps {
  title: string
  subtitle?: string
  showBackButton?: boolean
  backUrl?: string
  rightContent?: React.ReactNode
  gradient?: 'blue' | 'purple' | 'green' | 'orange' | 'teal'
}

const Header = ({
  title,
  subtitle,
  showBackButton = false,
  backUrl,
  rightContent,
  gradient = 'blue'
}: PageHeaderProps) => {
  const router = useRouter()

  const gradientClasses = {
    blue: 'from-blue-500 via-blue-600 to-blue-700',
    purple: 'from-purple-500 via-purple-600 to-purple-700',
    green: 'from-green-500 via-green-600 to-green-700',
    orange: 'from-orange-500 via-orange-600 to-orange-700',
    teal: 'from-teal-500 via-teal-600 to-teal-700',
  }

  const handleBack = () => {
    if (backUrl) {
      router.push(backUrl)
    } else {
      router.back()
    }
  }

  return (
    <header
      className={`bg-gradient-to-r ${gradientClasses[gradient]} rounded-b-2xl shadow-md`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center gap-3">
            {showBackButton && (
              <button
                onClick={handleBack}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md transition-all duration-200 hover:scale-105"
                aria-label="Go back"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
            )}
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
                {title}
              </h1>
              {subtitle && (
                <p className="text-white/80 text-sm sm:text-base mt-1">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Right Section */}
          {rightContent && (
            <div className="flex items-center gap-3">{rightContent}</div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
