"use client"

import { useState, useRef, useCallback, type ReactNode } from "react"
import { Loader2, RefreshCw } from "lucide-react"

interface PullToRefreshProps {
  onRefresh: () => Promise<void>
  children: ReactNode
  disabled?: boolean
}

export function PullToRefresh({ onRefresh, children, disabled = false }: PullToRefreshProps) {
  const [pullDistance, setPullDistance] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [startY, setStartY] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  
  const threshold = 80 // Distance needed to trigger refresh
  const maxPull = 120 // Maximum pull distance

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (disabled || isRefreshing) return
    
    const container = containerRef.current
    if (!container) return
    
    // Only start pull if scrolled to top
    if (container.scrollTop === 0) {
      setStartY(e.touches[0].clientY)
    }
  }, [disabled, isRefreshing])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (disabled || isRefreshing || startY === 0) return
    
    const container = containerRef.current
    if (!container || container.scrollTop > 0) return

    const currentY = e.touches[0].clientY
    const distance = currentY - startY

    if (distance > 0) {
      e.preventDefault()
      // Apply resistance to pull
      const resistedDistance = Math.min(distance * 0.5, maxPull)
      setPullDistance(resistedDistance)
    }
  }, [disabled, isRefreshing, startY, maxPull])

  const handleTouchEnd = useCallback(async () => {
    if (disabled || isRefreshing) return

    if (pullDistance >= threshold) {
      setIsRefreshing(true)
      try {
        await onRefresh()
      } catch (error) {
        console.error("Refresh error:", error)
      } finally {
        setIsRefreshing(false)
      }
    }

    setPullDistance(0)
    setStartY(0)
  }, [disabled, isRefreshing, pullDistance, threshold, onRefresh])

  const pullProgress = Math.min(pullDistance / threshold, 1)
  const rotation = pullProgress * 360

  return (
    <div
      ref={containerRef}
      className="h-full overflow-auto smooth-scroll"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull indicator */}
      <div
        className="flex items-center justify-center transition-all duration-200"
        style={{
          height: isRefreshing ? "60px" : `${pullDistance}px`,
          opacity: pullDistance > 0 || isRefreshing ? 1 : 0,
        }}
      >
        {isRefreshing ? (
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        ) : (
          <RefreshCw
            className="h-6 w-6 text-primary transition-transform duration-200"
            style={{
              transform: `rotate(${rotation}deg)`,
              opacity: pullProgress,
            }}
          />
        )}
      </div>

      {/* Content */}
      <div
        className="transition-transform duration-200"
        style={{
          transform: isRefreshing ? "translateY(0)" : `translateY(${pullDistance * 0.3}px)`,
        }}
      >
        {children}
      </div>
    </div>
  )
}

