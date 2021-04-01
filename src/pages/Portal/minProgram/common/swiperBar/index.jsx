/*
 * @Author: tdd
 * @Date: 2021-03-23 13:49:12 
 * @Last Modified by: tdd
 * @Last Modified time: 2021-03-23 13:49:12 
 * 轮播图控件
 */
import React, { useState, useEffect } from 'react';
import SwiperCore, { Navigation, Pagination, Virtual, Scrollbar, Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/swiper.less';
import 'swiper/components/navigation/navigation.less';
import 'swiper/components/pagination/pagination.less';
import 'swiper/components/scrollbar/scrollbar.less';

// install Swiper modules
SwiperCore.use([Navigation, Pagination, Scrollbar, Virtual, Autoplay]);

export default function Templates(props) {
  const [isAuthed, setisAuthed] = useState(false);

  useEffect(() => {}, []);

  function gotoRoute(key) {
    router.push(`${baseRrlKey}${key}`);
  }

  return (
    <Swiper
      autoplay={{
        delay: 3000, // 自动播放
        stopOnLastSlide: false,
        disableOnInteraction: true,
      }}
      pagination={{ clickable: true }} // 分页标志
      spaceBetween={50}
      slidesPerView={1} // 每次滚动几格
      initialSlide={1} // 初始化显示哪一个
      loop={true} // 是否循环
      onSlideChange={() => console.log('slide change')}
      onSwiper={swiper => console.log(swiper)}
    >
      <SwiperSlide>Slide 1</SwiperSlide>
      <SwiperSlide>Slide 2</SwiperSlide>
      <SwiperSlide>
        <a href="https://www.baidu.com/">Slide 3</a>
      </SwiperSlide>
      <SwiperSlide>Slide 4</SwiperSlide>
    </Swiper>
  );
}
