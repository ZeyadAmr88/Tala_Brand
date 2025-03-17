
// import Slider from "react-slick";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import axios from "axios";
// import { useState,useEffect } from "react";
// export default function CategoriesSlider() {
//   const [categories, setCategories] = useState([]);
//   async function getRecentCategories() {
//     try {
//       let { data } = await axios.get(
//         `https://ecommerce.routemisr.com/api/v1/categories/`
//       );
//       setCategories(data.data);
      
//     } catch (error) {
//       console.error("Error fetching product details:", error);
//     }
//   }
//   useEffect(() => {
//     getRecentCategories()
//   }, [])

//   var settings = {
//     dots: true,
//     infinite: true,
//     speed: 300,
//     slidesToShow: 7,
//     slidesToScroll: 3,
//     autoplay: true,
//     autoplayspeed: 500
//   };
//   return (
//   <div>
//       <Slider {...settings}>
//         {categories?.map((categories, index) => (<div key={index} className="m-5">

//           <img src={categories.image} className="w-full h-[200px]" alt="carousel"  />
//           <h3>{categories.name}</h3>
//         </div>
//         ))}

//       </Slider>
//   </div>
//   )
// }
