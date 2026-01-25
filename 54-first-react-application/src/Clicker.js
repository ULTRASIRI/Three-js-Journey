import { useState,useEffect } from "react"

export default function Clicker()
{
    
    const [count, setCount] = useState(parseInt(localStorage.getItem('count') ?? 0))

    useEffect (() =>
        {
            // const savedCount = parseInt(localStorage.getItem('count') ?? 0)
            // setCount(savedCount)
        }, [])

        
    useEffect (() =>
    {
        localStorage.setItem('count',count)
    }, [count])

    const buttonClick = () =>
    {
        setCount(count + 1)
    }

    return<div>
        <div> click count : {count}</div>
        <button onClick={ buttonClick }> click me</button>
    </div>
}