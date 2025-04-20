import {
  CheckIcon,
  PencilIcon,
  PlayIcon,
  RefreshCcw,
  SquareIcon,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Helmet } from 'react-helmet-async'

import { cn } from '@/@config/lib/cn'
import { Button } from '@/components/ui/button'

const timeValue = 15

export function Home() {
  const countDownTimeOut = useRef<NodeJS.Timeout | null>(null)
  const [time, setTime] = useState(timeValue)

  const hours = Math.floor(time / 3600)
  const minutes = Math.floor((time / 60) % 60)
  const seconds = time % 60

  const [isActive, setIsActive] = useState(false)
  const [hasFinished, setHasFinished] = useState(false)
  const [hasEdit, setHasEdit] = useState(false)
  const [hasPlayedCountDown, setHasPlayedCountDown] = useState(false)

  const [hoursLeft, hoursRight] = String(hours).padStart(2, '0').split('')
  const [minutesLeft, minutesRight] = String(minutes).padStart(2, '0').split('')
  const [secondsLeft, secondsRight] = String(seconds).padStart(2, '0').split('')

  const handleStartCountDown = () => {
    setIsActive(true)
  }

  const handlePauseCountDown = () => {
    setIsActive(false)
    if (countDownTimeOut.current) {
      clearTimeout(countDownTimeOut.current)
    }
  }

  const handleResetCountDown = () => {
    setIsActive(false)
    setHasFinished(false)
    setTime(timeValue)

    if (countDownTimeOut.current) {
      clearTimeout(countDownTimeOut.current)
    }
  }

  const updateTimePart = (
    part: 'hours' | 'minutes' | 'seconds',
    left: string,
    right: string,
  ) => {
    if (!/^\d*$/.test(left) || !/^\d*$/.test(right)) {
      return
    }

    const h =
      part === 'hours' ? Number(`${left}${right}`) : Math.floor(time / 3600)
    const m =
      part === 'minutes'
        ? Number(`${left}${right}`)
        : Math.floor((time / 60) % 60)
    const s = part === 'seconds' ? Number(`${left}${right}`) : time % 60

    const newTime = h * 3600 + m * 60 + s
    setTime(newTime)
  }

  useEffect(() => {
    if (isActive && time > 0) {
      if (time === 10 && !hasPlayedCountDown) {
        const countDownAudio = new Audio('/finishing.mp3')
        countDownAudio.play()
        setHasPlayedCountDown(true)
      }

      countDownTimeOut.current = setTimeout(() => {
        setTime((prevTime) => prevTime - 1)
      }, 1000)
    } else if (isActive && time === 0) {
      setHasFinished(true)
      setIsActive(false)
      setHasPlayedCountDown(false)
    }
  }, [isActive, time, hasPlayedCountDown])

  const hasTimeGreaterThanTen = !isActive || time > 10 || time === 0

  return (
    <div
      className={cn(
        'flex min-h-screen items-center justify-center overflow-hidden bg-zinc-900 transition-all duration-1000',
        hasFinished ? 'bg-emerald-600' : 'bg-zinc-900',
      )}
    >
      <Helmet
        title={`${hasFinished ? 'FINALIZOU SEU TEMPORIZER!' : `${hasTimeGreaterThanTen ? `${hoursLeft}${hoursRight}:${minutesLeft}${minutesRight}:${secondsLeft}${secondsRight}` : `${seconds} ${seconds === 1 ? 'segundo' : 'segundos'}`}`}`}
      />
      <div className="relative flex flex-col items-center">
        {/* Logo */}
        {!hasFinished && (
          <img
            src="/logo.svg"
            alt="Logo Temporizer"
            className={cn(
              'pointer-events-none visible absolute -top-20 w-60 select-none opacity-100 transition-all duration-300 md:w-80',
              !isActive ||
              (!hasTimeGreaterThanTen &&
                !hasEdit &&
                'visible -top-72 opacity-0'),
            )}
          />
        )}

        {/* Contador */}
        <div
          className={cn(
            'flex select-none items-center font-orbitron text-[2.5rem] font-medium text-emerald-500 transition-all sm:text-[4rem] md:text-[6rem]',
            hasFinished && 'text-white',
          )}
        >
          {!hasFinished ? (
            <>
              <div
                className={cn(
                  'visible relative bottom-0 flex items-center opacity-100 transition-all duration-500',
                  !isActive ||
                  (!hasTimeGreaterThanTen &&
                    !hasEdit &&
                    'invisible bottom-72 text-zinc-700 opacity-0'),
                )}
              >
                <div className="flex gap-1">
                  <input
                    type="text"
                    maxLength={1}
                    value={hoursLeft}
                    readOnly={!hasEdit}
                    onChange={(e) => {
                      const value = e.target.value
                      if (/^\d*$/.test(value) || value === '') {
                        updateTimePart('hours', value, hoursRight)
                      }
                    }}
                    className={cn(
                      'w-[1.2ch] rounded-sm border-2 border-transparent bg-zinc-800 text-center font-orbitron outline-none',
                      hasEdit && 'border-emerald-500',
                    )}
                  />

                  <input
                    type="text"
                    maxLength={1}
                    value={hoursRight}
                    readOnly={!hasEdit}
                    onChange={(e) =>
                      updateTimePart('hours', hoursLeft, e.target.value)
                    }
                    className={cn(
                      'w-[1.2ch] rounded-sm border-2 border-transparent bg-zinc-800 text-center font-orbitron outline-none',
                      hasEdit && 'border-emerald-500',
                    )}
                  />
                </div>
                <span>:</span>
                <div className="flex gap-1">
                  <input
                    type="text"
                    maxLength={1}
                    value={minutesLeft}
                    readOnly={!hasEdit}
                    onChange={(e) =>
                      updateTimePart('minutes', e.target.value, minutesRight)
                    }
                    className={cn(
                      'w-[1.2ch] rounded-sm border-2 border-transparent bg-zinc-800 text-center font-orbitron outline-none',
                      hasEdit && 'border-emerald-500',
                    )}
                  />

                  <input
                    type="text"
                    maxLength={1}
                    value={minutesRight}
                    readOnly={!hasEdit}
                    onChange={(e) =>
                      updateTimePart('minutes', minutesLeft, e.target.value)
                    }
                    className={cn(
                      'w-[1.2ch] rounded-sm border-2 border-transparent bg-zinc-800 text-center font-orbitron outline-none',
                      hasEdit && 'border-emerald-500',
                    )}
                  />
                </div>
                <span>:</span>
                <div className="flex gap-1">
                  <input
                    type="text"
                    maxLength={1}
                    value={secondsLeft}
                    readOnly={!hasEdit}
                    onChange={(e) =>
                      updateTimePart('seconds', e.target.value, secondsRight)
                    }
                    className={cn(
                      'w-[1.2ch] rounded-sm border-2 border-transparent bg-zinc-800 text-center font-orbitron outline-none',
                      hasEdit && 'border-emerald-500',
                    )}
                  />

                  <input
                    type="text"
                    maxLength={1}
                    value={secondsRight}
                    readOnly={!hasEdit}
                    onChange={(e) =>
                      updateTimePart('seconds', secondsLeft, e.target.value)
                    }
                    className={cn(
                      'w-[1.2ch] rounded-sm border-2 border-transparent bg-zinc-800 text-center font-orbitron outline-none',
                      hasEdit && 'border-emerald-500',
                    )}
                  />
                </div>
              </div>

              <div
                className={cn(
                  'visible absolute bottom-0 left-1/2 -translate-x-1/2 opacity-100 transition-all duration-700',
                  (!isActive || hasTimeGreaterThanTen || hasEdit) &&
                  'invisible bottom-40 opacity-0',
                )}
              >
                <span>{seconds}</span>
              </div>
            </>
          ) : (
            <div>
              <span>0</span>
            </div>
          )}
        </div>

        {/* Botões de ação */}
        <div
          className={cn(
            'left visible absolute -bottom-20 left-1/2 flex -translate-x-1/2 items-center gap-8 opacity-100 transition-all duration-500',
            (hasEdit || !hasTimeGreaterThanTen) &&
            'invisible -bottom-72 opacity-0',
          )}
        >
          {!hasFinished && (
            <Button
              size="icon"
              variant="outline"
              title="clique para abilitar o contador"
              type="button"
              className="rounded-full bg-transparent text-white"
              onClick={() => {
                handlePauseCountDown()
                setHasEdit((prev) => !prev)
              }}
            >
              <PencilIcon className="size-4" />
              <span className="sr-only">Edit</span>
            </Button>
          )}

          <Button
            size="icon"
            variant="outline"
            type="button"
            title="clique para resetar o contador"
            onClick={handleResetCountDown}
            className={cn(
              'rounded-full bg-transparent text-white transition-all duration-500',
              hasFinished && 'bg-white text-zinc-600',
            )}
          >
            <RefreshCcw className="size-4" />
            <span className="sr-only">Reset</span>
          </Button>

          {!hasFinished && (
            <>
              <Button
                size="icon"
                variant="outline"
                type="button"
                disabled={!isActive}
                onClick={handlePauseCountDown}
                title="clique para pausar o contador"
                className="rounded-full bg-transparent text-rose-500"
              >
                <SquareIcon className="size-4" />
                <span className="sr-only">Pause</span>
              </Button>
              <Button
                size="icon"
                variant="outline"
                type="button"
                disabled={isActive}
                onClick={handleStartCountDown}
                title="clique para iniciar o contador"
                className="rounded-full bg-transparent text-emerald-500 transition-all duration-500"
              >
                <PlayIcon className="size-4" />
                <span className="sr-only">Start</span>
              </Button>
            </>
          )}
        </div>

        <div
          className={cn(
            'invisible absolute -bottom-72 left-1/2 flex -translate-x-1/2 items-center gap-8 opacity-0 transition-all duration-500',
            hasEdit && 'visible -bottom-20 opacity-100',
          )}
        >
          <Button
            size="icon"
            type="button"
            variant="outline"
            onClick={() => setHasEdit(false)}
            title="clique para cancelar a edição do contador"
            className="rounded-full bg-transparent text-emerald-500"
          >
            <CheckIcon className="size-4" />
            <span className="sr-only">Cancel edition</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
