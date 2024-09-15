import React, { useRef, useEffect, memo } from 'react';  

// 图片懒加载
function LazyLoadImage({ src, alt, class_name, style_, onTouchStart,onTouchMove,onTouchEnd,onDragStart,key }) {  
    const imgRef = useRef(null);  

    useEffect(() => {  
        const observer = new IntersectionObserver(([entry]) => {  
            if (entry.isIntersecting) {  
                const img = imgRef.current;  
                img.src = src;  
                observer.unobserve(img);  
            }  
        });  
        if (imgRef.current) {  
            observer.observe(imgRef.current);  
        }  

        return () => {  
            observer.disconnect();  
        };  
    }, [src]);  

    return <img ref={imgRef} alt={alt} className={class_name} style={style_}/>;  
}  

export default memo(LazyLoadImage);