//// navigate to gameOverPage when timer hits 0
import { useNavigate } from "react-router-dom"
import { useMemo } from "react"
import { useTimer } from "react-timer-hook"
import { Progress } from "@/components/ui/progress"
// 1. Decide the input props
// 2. convert into seconds

type CountdownProps = {
    minutes: number,
    onTimeUp?: () => void; //callback when time is up
    label?: string,
}

const Countdown = ({ minutes, onTimeUp, label = "Time left" }: CountdownProps) => {


    //converts min to sec ,floor is to get whole number not decimal num, max is get max output 1 not 0 or negative
    const totalSeconds = Math.max(1, Math.floor(minutes * 60))

    const expiry = useMemo(() => {
        const end = new Date()//create a date obj 
        end.setSeconds(end.getSeconds() + totalSeconds)//add totalSec with curr seconds
        return end;


    }, [totalSeconds])//useMemo() is performance optimization way that caches the results of expensive operations , renders only when dep value changes


    const { minutes: mins, seconds, totalSeconds: remaining } = useTimer({//as timer decreases the total seconds decreases
        expiryTimestamp: expiry,
        onExpire() {
            if (onTimeUp) onTimeUp();//tell the parent that time is up
        },

    })

    const countdown = `${mins}:${seconds.toString().padStart(2, "0")}`//convert 2:5 into 2:05 ,so seconds.toString().padStart(2,"0") make 05,04

    const progressValue = (remaining / totalSeconds) * 100// ratio gives num b/w 0 to 1 , then * to get percentage like 30/120 =0.25 ,0.25*100 =25

    return (<>
        <div className="flex w-40 flex-col gap-1 ">
            <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
                <span>{label}</span>
                <span className="tabular-nums">{countdown}</span>
            </div>
            <div>
                <Progress value={progressValue}></Progress>
            </div>
        </div >
    </>)

}




export default Countdown;