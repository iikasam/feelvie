<template>
  <!-- 상단 -->
  <section class="detail_container"
    :style="{ backgroundImage: 'url( https://image.tmdb.org/t/p/w1920_and_h800_multi_faces/' + this.backGround + ')' }">
    <div class="detail_info">
      <h1 :class="{ skeleton: isLoading }">
        {{ this.type == "movie" ? movieDetail.title : movieDetail.name }}
      </h1>
      <div class="meta">
        <span class="txt" v-for="list in movieDetail.genres" :key="list.id">
          {{ list.name }}
        </span>
      </div>
      <div class="comment" :class="{ skeleton: isLoading }">
        <p class="quotes" v-if="movieDetail.tagline">{{ movieDetail.tagline }}</p>
        <p class="intro">{{ movieDetail.overview }}</p>
      </div>
    </div>
    <div class="detail_poster">
      <ul class="social_links" :class="{ skeleton: isLoading }">
        <li v-if="this.facebookLink">
          <a :href="`https://facebook.com/${this.facebookLink}`" class="facebook" target="_blank">
            <span class="blind">페이스북</span>
          </a>
        </li>
        <li v-if="this.twitterLink">
          <a :href="`https://twitter.com/${this.twitterLink}`" class="tritter" target="_blank">
            <span class="blind">트위터</span>
          </a>
        </li>
        <li v-if="this.instagramLink">
          <a :href="`https://instargram.com/${this.instagramLink}`" class="instargram" target="_blank">
            <span class="blind">인스타그램</span>
          </a>
        </li>
      </ul>
      <picture :class="{ skeleton: isLoading }">
        <img :src="image(movieDetail.poster_path)" alt="Image 2">
      </picture>
    </div>
  </section>
  <!-- 등장인물 -->
  <div class="item_container movie">
    <div class="title">
      <h2>등장인물</h2>
    </div>
    <swiper :slidesPerView="'auto'" class="mySwiper person_list" v-if="personList">
      <swiper-slide class="person_card" v-for="person in personList" :key="person.id" @click="goPeronDetail(person.id)">
        <picture>
          <img :src="profile(person.profile_path)" alt="Image 2">
        </picture>
        {{ person.original_name }}
      </swiper-slide>
      <swiper-slide v-if="this.personList.length >= 10">
        <router-view>더보기</router-view>
      </swiper-slide>
    </swiper>

    <div class="media_container">
      <div class="media_top">
        <h3 class="tit">미디어</h3>
        <!-- 탭 영역 -->
        <ul class="media_tab">
          <li v-for="(tab, index) in tabList" :key="index" :class="{ active: currentTab === index }">
            <button @click.prevent="currentTab = index">{{ tab }} </button>
          </li>
        </ul>
      </div>
      <!-- 미디어 1 -->
      <div v-show="currentTab == 0" class="media_list">
        <swiper :slidesPerView="'auto'" class="mySwiper" v-if="imageList.posters">
          <swiper-slide v-for="backdrops in imageList.posters" :key="backdrops.id"
            @click="modal = true, img = backdrops.file_path, width = backdrops.width, height = backdrops.height">
            <img :src="profile(backdrops.file_path)" alt="Image 2">
          </swiper-slide>
        </swiper>
      </div>

      <!-- 미디어 2 -->
      <div v-show="currentTab == 1" class="media_list bg">
        <swiper :slidesPerView="'auto'" class="mySwiper" v-if="imageList.backdrops">
          <swiper-slide v-for="backdrops in imageList.backdrops" :key="backdrops.id"
            @click="modal = true, img = backdrops.file_path, width = backdrops.width, height = backdrops.height">
            <img :src="profile(backdrops.file_path)" alt="Image 2">
          </swiper-slide>
        </swiper>
      </div>
      <!-- 미디어 3 -->
      <div v-show="currentTab == 2" class="media_list video">
        <swiper :slidesPerView="'auto'" class="mySwiper" v-if="videoLink">
          <swiper-slide v-for="video in videoLink" :key="video.id">

            <iframe :src="`https://youtube.com/embed/${video.key}`" title="YouTube video player" frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen></iframe>
            <a :href="`https://youtube.com/embed/${video.key}`" style="color:#fff">
              {{ video.name }} </a>
          </swiper-slide>
        </swiper>
      </div>
    </div>

    <div class="title">
      <h2>추천 작품</h2>
    </div>
    <ItemList :movieList="recommendList" :type="this.type" :title="title[0]" :photo="recommend_photo"></ItemList>
  </div>

  <bgModal v-if="modal" @close="modal = false" :img="img" :width="width" :height="height"></bgModal>

</template>

<script>
import ItemList from './ItemList.vue'
import bgModal from './bgModal.vue'
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import { movieApi } from '../utils/axios';

export default {
  name: 'ItemDetail_',
  data() {
    return {
      backGround: '',
      movieDetail: {},
      imageList: [],
      currentTab: 0,
      tabList: ['포스터', '배경', '동영상'],
      title: ['추천 작품들', '이 영화와 비슷한 작품들'],
      modal: false,
      img: '',
      width: '',
      height: '',
      images: ['image_none.png'],
      isLoading: true,
      recommend_photo: '',
      recommendList: '',
      personList: '',
      videoLink: '',
      type: '',
      facebookLink: '',
      twitterLink: '',
      instagramLink: '',
    };
  },
  methods: {
    image(img) {
      return `https://image.tmdb.org/t/p/w400/${img}`
    },
    // 이미지
    profile(img) {
      if (img == undefined) {
        // 이미지 없을 때
        return require(`@/assets/${this.images}`)
      } else {
        return `https://image.tmdb.org/t/p/w185/${img}`
      }
    },
    goPeronDetail(id) {
      this.$router.push(`/person/${id}`);
    }
  },
  async created() {
    
    
    // 영화 ID값에 따른 정보
    const { type, id } = this.$route.params;
    const { data } = await movieApi.movieDetail(type, id);
    this.isLoading = false
    this.movieDetail = data;
    // movie or tv
    this.type = type

    // 배경
    this.backGround = this.movieDetail.backdrop_path

    // 등장인물
    const person = await movieApi.person(this.type, this.movieDetail.id);
    this.personList = person.data.cast.splice(0, 10);

    // 관련 이미지
    const image = await movieApi.image(this.type, this.movieDetail.id);
    this.imageList = image.data


    // 관련 동영상
    const video = await movieApi.video(this.type, this.movieDetail.id);
    this.videoLink = video.data.results

    // 추천 작품
    const recommend = await movieApi.recommend(this.type, this.movieDetail.id);
    this.recommendList = recommend.data.results;
    this.recommend_photo = this.recommendList.map(key => key.poster_path)

    // 소셜
    const social = await movieApi.social(this.type, this.movieDetail.id);
    this.facebookLink = social.data.facebook_id
    this.twitterLink = social.data.twitter_id
    this.instagramLink = social.data.instagram_id


    
  },
  mounted() {
  },
  components: {
    Swiper,
    SwiperSlide,
    ItemList,
    bgModal
  }
}
</script>
<style>
.detail_container {position: relative;display: flex;height:44.688rem;padding:9.375rem 4.375rem 4.375rem;color: #fff;overflow:hidden;background-size:cover;background-position:center}
.detail_container .detail_info {position: relative;margin:3.125rem 3.125rem 0 0;width:100%;z-index:1}
.detail_container .detail_info h1 {font-size:3.25rem}
.detail_container .detail_info .meta {display:flex;align-items:center;margin-top:2rem}
.detail_container .detail_info .meta:before {display:block;margin-right:1.25rem;width:1.875rem;height:1.5rem;background:url("data:image/svg+xml,%3Csvg width='30' height='23' viewBox='0 0 30 23' fill='none' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Cmask id='mask0_231_5' style='mask-type:alpha' maskUnits='userSpaceOnUse' x='0' y='0' width='30' height='23'%3E%3Crect width='30' height='22.75' fill='url(%23pattern0)'/%3E%3C/mask%3E%3Cg mask='url(%23mask0_231_5)'%3E%3Crect width='30' height='22.75' fill='white'/%3E%3C/g%3E%3Cdefs%3E%3Cpattern id='pattern0' patternContentUnits='objectBoundingBox' width='1' height='1'%3E%3Cuse xlink:href='%23image0_231_5' transform='translate(0 -0.0151099) scale(0.00195312 0.00257555)'/%3E%3C/pattern%3E%3Cimage id='image0_231_5' width='512' height='400' xlink:href='data:image/png;base64,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'/%3E%3C/defs%3E%3C/svg%3E%0A") center no-repeat;content:''}
.detail_container .detail_info .meta .txt {display:flex;align-items:center;font-size:1.375rem}
.detail_container .detail_info .meta .txt+.txt:before {display:block;margin:0 0.625rem;width:0.188rem;height:0.188rem;border-radius:50%;background:#fff;content:''}
.detail_container .detail_info .meta .badge {display:inline-block;margin-right:0.5rem;padding: 0 0.5rem;color: #fff;font-size:0.875rem;line-height:1.25rem;border: 1px solid #fff;border-radius:0.25rem;background: #000}
.detail_container .detail_info .trailer {margin-top:1.875rem;display: inline-block;padding:1.25rem 0;width:19.688rem;font-size:1.5rem;border-radius:0.25rem;text-align: center;background: #fff}
.detail_container .detail_info .comment {position: absolute;bottom: 0}
.detail_container .detail_info .comment .quotes {margin-bottom:2rem;color: #3A7CDF;font-size:1.875rem;font-style: italic;}
.detail_container .detail_info .comment .intro {display: -webkit-box;font-size:1.5rem;line-height:2.125rem;overflow: hidden;text-overflow: ellipsis;-webkit-line-clamp: 3;-webkit-box-orient: vertical}
.detail_container .detail_poster {position: relative;display: flex;justify-content: flex-end;width: 100%;z-index: 1}
.detail_container .detail_poster picture {margin-left:1.875rem;width:25rem}
.detail_container .detail_poster picture img {width:100%}
.detail_container .detail_poster .social_links li {display: flex;align-items: center;justify-content: center;width:4.5rem;height:4.5rem;border-radius:50%;background: #fff}
.detail_container .detail_poster .social_links li+li {margin-top:0.938rem}
.detail_container .detail_poster .social_links li a {width:3.125rem;height:3.125rem;background: #000}
.detail_container .detail_poster .social_links li a.facebook {background: url(./../assets/icon_facebook.png) center / 100% no-repeat}
.detail_container .detail_poster .social_links li a.tritter {background: url(./../assets/icon_twitter.png) center / 100% no-repeat}
.detail_container .detail_poster .social_links li a.instargram {background: url(./../assets/icon_instagram.png) center / 100% no-repeat}
.detail_container .detail_poster .social_links.skeleton a {background:#fff}
.detail_container::before {content: "";position: absolute;inset:-10rem;background-color: rgba(0, 0, 0, 0.5);}
.detail_container::after {content: "";position: absolute;bottom:-2px;left:-1rem;right:-1rem;height:25rem;background-image:linear-gradient(to top, rgb(0, 0, 0), rgba(0, 0, 0, 0));}

.person_list .person_card {width:auto;cursor:pointer}
.person_list .person_card+.person_card {margin-left:1.25rem}
.person_list .person_card picture {display: block;width:8.313rem;margin-bottom:0.938rem;font-size:1.375rem;border-radius:0.5rem;overflow:hidden}
.person_list .person_card picture img {width:100%}
.person_list .person_card:hover picture img {transform:scale(1.1);transition: transform .3s ease-in-out}
.person_list .person_card h3 {margin-top:0.625rem;color: #fff;font-size:1rem}

.media_container {margin:5rem 0}
.media_container .media_top {display: flex;color: #fff;margin-bottom:2rem}
.media_container .media_top .tit {font-size:2rem}
.media_container .media_tab {display:flex;align-items:center;margin-left:1.042vw}
.media_container .media_tab li+li {margin-left:0.625rem} 
.media_container .media_tab li button {padding:0.375rem 0.938rem;color:#fff;font-size:1rem;line-height:1.25rem;border:1px solid #fff;border-radius:3.125rem;background:#000}
.media_container .media_tab li.active button {color:#000;border-color:#000;background:#fff}
.media_container .media_list .swiper-slide {width:11.563rem;cursor:pointer}
.media_container .media_list .swiper-slide+.swiper-slide {margin-left:1.25rem}
.media_container .media_list .swiper-slide img {width:100%}
.media_container .media_list.bg .swiper-slide {width:11.563rem}
.media_container .media_list.video .swiper-slide {width:15.625rem}
.media_container .media_list.video .swiper-slide iframe {width:100%}
.media_container .media_list.video .swiper-slide a {display:block;margin-top:0.938rem;width:100%;font-size:1.125rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap} 

.detail_container .detail_info .comment.skeleton .quotes {width:500px;height:55px;border-radius:4px;background:#f4f6fa}
.detail_container .detail_info .comment.skeleton .intro {margin-top:20px;width:1000px;height:55px;border-radius:4px;background:#f4f6fa}
.detail_container .detail_poster picture.skeleton img {width:25rem;height:35.438rem;background:#f4f6fa}

@media screen and (max-width: 768px) {
  .detail_container {flex-direction: row-reverse;flex-wrap:wrap-reverse;padding-bottom:0}
  .detail_container .detail_info {margin:0;text-align:center}
  .detail_container .detail_info h1 {margin-top:0}
  .detail_container .detail_info .meta {justify-content:center}
  .detail_container .detail_info .comment .quotes {margin-top:2rem}
  .detail_container .detail_info .comment .intro {margin:0 2rem}
  .detail_container .detail_poster {flex-direction: column-reverse;justify-content:center;margin-bottom:1.5rem;padding:6rem 0 1rem}
  .detail_container .detail_poster .social_links {display:flex;justify-content:center;margin-top:2rem}
  .detail_container .detail_poster .social_links li+li {margin-top:0;margin-left:0.938rem}
  .detail_container .detail_poster picture {margin:0 auto;width:15rem}
  .detail_container .detail_info .comment {position:relative}

  .person_list .person_card  {width:75px}

  .media_container .media_list .swiper-slide {width:12.25rem}
  .media_container .media_list.bg .swiper-slide {width:18.75rem}
  .media_container .media_list.video .swiper-slide {width:25rem}
  .media_container .media_list.video .swiper-slide a {font-size:0.875rem}
}
</style>


