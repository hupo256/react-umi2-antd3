/*
 * @Author: tdd
 * @Date: 2021-03-23 13:49:12 
 * @Last Modified by: tdd
 * @Last Modified time: 2021-03-23 13:49:12 
 * 轮播图控件
 */
import React, { useState, useEffect, useContext } from 'react';
import SwiperCore, { Pagination, Virtual, Scrollbar, Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { defaultImg } from '../../tools/data';

import 'swiper/swiper.less';
import 'swiper/components/pagination/pagination.less';
import 'swiper/components/scrollbar/scrollbar.less';
import './swiperBar.less';
import pageStyle from '../../preview/preview.less';

// install Swiper modules
SwiperCore.use([Pagination, Scrollbar, Virtual, Autoplay]);

export default function SwiperBar(props) {
  const { list, height = 176 } = props;
  return (
    <>
      {list?.length > 0 ? (
        <div style={{ height }}>
          <Swiper
            // autoplay={{
            //   delay: 3000, // 自动播放
            //   stopOnLastSlide: false,
            //   disableOnInteraction: true,
            // }}
            pagination={{ clickable: true }} // 分页标志
            spaceBetween={50}
            slidesPerView={1} // 每次滚动几格
            initialSlide={1} // 初始化显示哪一个
            loop={true} // 是否循环
          >
            {list.map((img, ind) => {
              const { imgUrl } = img;
              return (
                <SwiperSlide key={ind}>
                  {imgUrl ? (
                    <img src={imgUrl} alt="" />
                  ) : (
                    <div className="deftImg">
                      <div>
                        <img src={`${defaultImg}ic_Image.png`} alt="" />
                        <p>请在右侧上传图片</p>
                      </div>
                    </div>
                  )}
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      ) : (
        <div className={pageStyle.defaultImgBox}>
          <svg className="icon" aria-hidden="true">
            <use href="#iconic_case_no" />
          </svg>
          <span>请在右侧上传照片</span>
        </div>
      )}
    </>
  );
}
