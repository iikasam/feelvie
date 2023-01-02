<template>
    <div class="container">
        <swiper :pagination="pagination" :navigation="true" :modules="modules" class="mySwiper home_banner">
            <swiper-slide v-for="list in list" :key='list.id'
                :style="{ backgroundImage: 'url( https://image.tmdb.org/t/p/w1920_and_h800_multi_faces/' + list.backdrop_path + ')' }"
                @click="goDetail(list_type, list.id)" class="banner">
                <div class="banner_txt">
                    <h2 class="tit"> {{ list.title }} </h2>
                    <p> {{ list.overview }}</p>
                </div>
            </swiper-slide>
        </swiper>


        <div class="item_container">

            <!-- 지금 상영중인 영화 -->
            <div class="title">
                <h2>지금 상영중이에요!</h2>
                <ul class="type_list">
                    <li>
                        <button type="button" class="" :class="{active : activatedTarget=='a'}"
                            @click="ganreTab('movie', 'now_playing', 'a')">영화</button>
                    </li>
                    <li>
                        <button type="button" :class="{active : activatedTarget=='b'}" @click="ganreTab('tv', 'on_the_air', 'b')">TV</button>
                    </li>
                </ul>
            </div>
            <ItemList :movieList="nowPlaying" :type="list_type" :title="title[0]" :photo="now_photo"></ItemList>

            <!-- 가장 인기있는 컨텐츠 -->
            <div class="title">
                <h2>가장 인기있는 컨텐츠</h2>
            </div>
            <ItemList :movieList="TopRatedList" :type="list_type" :title="title[2]" :photo="top_photo"></ItemList>

            <!-- 오늘 가장 많이 찾아 본 컨텐츠 -->
            <div class="title">
                <h2>오늘 가장 많이 찾아 본 컨텐츠</h2>
            </div>
            <ItemList v-if="dayList" :movieList="dayList" :type="list_type" :title="title[0]" :photo="day_photo">
            </ItemList>


            <!-- 이번 주 가장 많이 찾아 본 컨텐츠 -->
            <div class="title">
                <h2>이번 주 가장 많이 찾아 본 컨텐츠</h2>
            </div>
            <ItemList :movieList="weekList" :title="title[1]" :photo="week_photo"></ItemList>
        </div>

        <Modal v-if="modal" @close="modal = false"></Modal>
    </div>
</template>
<script>
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import Modal from './Modal.vue'
import ItemList from './ItemList.vue'
import "swiper/css/navigation";
import { Pagination, Navigation } from "swiper";
import { movieApi } from '../utils/axios';

export default {
    name: 'Main_',
    data() {
        return {
            nowPlaying: {},
            popular: {},
            TopRatedList: {},

            title: ['지금 상영중인 영화', '인기있는 영화', '최고의 등급'],
            popularTv: [],
            popularMovie: [],
            dayList: [],
            list_type: 'movie',
            list: [],
            list2: [],
            weekList: [],
            nowType: '',
            listInfo:
                [
                    { title: '지금 상영중인 영화', photo: this.now_photo },
                    { title: '인기있는 영화', photo: this.pop_photo },
                    { title: '최고의 등급', photo: this.pop_photo },
                ],
            modal: false,
            genreTitle: '',
            selected: '',
            btnList: [
                { title: '영화', type: 'movie', test: 'now_playing' },
                { title: 'TV프로그램', type: 'tv', test: 'on_the_air' }
            ],
            activatedTarget: 'a'
        }
    },
    methods: {
        goDetail(type, id) {
            this.$router.push(`/${type}/${id}`);
        },

        async ganreTab(id, nowType, tag) {
            this.list_type = id;
            const now = await movieApi.nowPlaying(this.list_type, nowType);
            this.nowPlaying = now.data.results;
            this.now_photo = this.nowPlaying.map(key => key.poster_path)
            this.top_photo = this.TopRatedList.map(key => key.poster_path)
            this.activatedTarget = tag;
        },
    },
    components: {
        Swiper,
        SwiperSlide,
        ItemList,
        Modal
    },
    async mounted() {

        const now = await movieApi.nowPlaying(this.list_type, 'now_playing');
        this.nowPlaying = now.data.results;
        const TopRated = await movieApi.TopRated(this.list_type);
        this.TopRatedList = TopRated.data.results;

        this.now_photo = this.nowPlaying.map(key => key.poster_path)
        this.top_photo = this.TopRatedList.map(key => key.poster_path)


        // 기존에 뿌려주고 클릭 시 재랜더링...!?!!!
        const trendingDay = await movieApi.trending(this.list_type, 'day');
        const trendingWeek = await movieApi.trending(this.list_type, 'week');

        this.dayList = trendingDay.data.results
        this.weekList = trendingWeek.data.results

        this.day_photo = this.dayList.map(key => key.poster_path)
        this.week_photo = this.weekList.map(key => key.poster_path)


        // 배너
        const popularTv = await movieApi.popularTv('movie');
        this.popularTv = popularTv.data.results;
        const korean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
        this.list = this.popularTv.filter(value => korean.test(value.title) && korean.test(value.overview)).splice(0, 5);


        const genre = await movieApi.genre('movie');
        this.genreTitle = genre.data.genres;
        // // 장르
        // const bannerGenre = this.list.forEach(item => {
        //     this.genreTitle.forEach(genre => {
        //         console.log(item.genre_ids)
        //         console.log(genre)
        //     })
        // })

        // console.log(bannerGenre)

        this.backGround = this.popularTv.backdrop_path
    },

    // 페이지네이션
    setup() {
        return {
            pagination: {
                clickable: true,
                renderBullet: function (index, className) {
                    return '<span class="' + className + '">' + `<span class="blind">` + (index + 1) + `</span>` + "</span>";
                },
            },
            modules: [Navigation, Pagination],
        };
    },
}
</script>

<style>
.home_banner {position:relative;height:48.75rem;margin-bottom:2.25rem}
.home_banner .banner_txt {position:absolute;left:3.125rem;bottom:3.125rem;z-index:10}
.home_banner .banner_txt .tit {font-size:2.5rem}
.home_banner .banner_txt p {margin-top:1.875rem;width:calc(100% - 3.125rem);font-size:1.5rem;line-height:2.125rem;display:-webkit-box;overflow:hidden;text-overflow:ellipsis;-webkit-line-clamp: 3;-webkit-box-orient: vertical}

.banner {background-size:cover;background-position:center}
.banner:after{content: "";
display: block;
position: absolute;
bottom: 0px;
width: 100%;
padding-bottom: 15.833rem;
background-image: linear-gradient(to top, rgb(0, 0, 0), rgba(0, 0, 0, 0));}
.swiper-button-prev,
.swiper-button-next {width:6.25rem;height:9.375rem;transform:translateY(-50%);z-index:10}
.swiper-button-next.swiper-button-disabled, .swiper-button-prev.swiper-button-disabled {pointer-events:auto}

.swiper-pagination {display:flex;justify-content:center;margin:15px auto 0}
.swiper-pagination-bullet {display:block;width:1rem;height:1rem;border-radius:0.5rem;background:#fff;cursor:pointer}
.swiper-pagination-bullet+.swiper-pagination-bullet {margin-left:0.5rem}
.swiper-pagination-bullet.swiper-pagination-bullet-active {background:red}




</style>