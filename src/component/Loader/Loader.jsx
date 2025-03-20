
import { ThreeCircles } from 'react-loader-spinner';

export default function Loader() {
    return (
        <ThreeCircles
            visible={true}
            height="100vh"
            width="100"
            color="#ff42a0"
            ariaLabel="three-circles-loading"
            wrapperStyle={{ }}
            wrapperClass=""
        />)

}
