
import { RotatingLines } from 'react-loader-spinner'

// eslint-disable-next-line react/prop-types
export default function Loader({color ="pink"}) {
    return (
        <RotatingLines
            visible={true}
            height="96"
            width="96"
            color= {color}
            strokeWidth="5"
            animationDuration="0.75"
            ariaLabel="rotating-lines-loading"
            wrapperStyle={{}}
            wrapperClass=""
            
        />
    )
}
