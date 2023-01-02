<template>
    <div class="item_container">
        <swiper :slidesPerView="'auto'" class="mySwiper genre_title" v-if="genreTitle">
            <swiper-slide class="genre_item" @click="GenreListAll()"
                :class="{ active: genreAllActive }">
                All
            </swiper-slide>
            <swiper-slide class="genre_item" v-for="(genreList, i ) in genreTitle" :key="genreList.id"
                @click="GenreList(genreList.id, i)" :class="{ active: i === genreTitleActive }">
                {{ genreList.name }}
            </swiper-slide>
        </swiper>

        <ul class="ganre_list" v-if="genreList" @scroll="handleNotificationListScroll">
            <li v-for="item in genreList" :key="item.id" @click="goDetail(this.linkValue, item.id)"
                class="list_card">
                <picture>
                    <img :src="image(item.poster_path)" alt="">
                </picture>
                <p class="tit"> {{ this.linkValue == "movie" ? item.title : item.name }} </p>
            </li>
        </ul>
    </div>
</template>

<script>
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import { movieApi } from '../utils/axios';

export default {
    name: 'Ganre_',
    props: ['linkValue'],
    data() {
        return {
            genre: '',
            genreTitle: {},
            genreList: {},
            page: 1,
            genreAllActive: true,
            genreTitleActive: null,
        };
    },

    async mounted() {
        // 장르타이틀
        const { data } = await movieApi.genre(this.linkValue);
        this.genreTitle = data.genres;

        // 장르리스트 (타이틀이 한글일 경우에만)
        const korean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
        const popular = await movieApi.popular(this.linkValue);
        this.genreList = popular.data.results.filter(value => korean.test(value.name) || korean.test(value.title));
    },

    methods: {
        // 장르 All 클릭
        async GenreListAll() {
            const popular = await movieApi.popular(this.linkValue);
            this.genreList = popular.data.results;
            this.genreTitleActive = null;
            this.genreAllActive = true
        },
        // 장르 타이틀 클릭
        async GenreList(value, i) {
            this.page = 1;
            this.genre = value;
            const { data } = await movieApi.genreList(this.linkValue, this.genre, this.page);
            const korean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
            this.genreList = data.results.filter(value => korean.test(value.name) || korean.test(value.title));
            this.genreTitleActive = i;
            this.genreAllActive = false;
        },

        // Scroll
        handleNotificationListScroll(e) {
            const { scrollHeight, scrollTop, clientHeight } = e.target;
            const isAtTheBottom = scrollHeight === scrollTop + clientHeight;
            if (isAtTheBottom) this.handleLoadMore();
        },
        async handleLoadMore() {
            this.page++
            const { data } = await movieApi.genreList(this.genre, this.page)
            this.list = [...this.list, ...data.results]
        },

        // 포스터
        image(img) {
            return `https://image.tmdb.org/t/p/w300/${img}`
        },

        // 영화상세내용으로
        goDetail(type, id) {
            this.$router.push(`/${type}/${id}`);
        },
    },
    components: {
        Swiper,
        SwiperSlide
    }
}
</script>

<style>
.genre_title {margin:5rem 0 3rem}
.genre_title .genre_item {width: auto;padding: 0.625rem 1.25rem;color: #fff;font-size: 1.25rem;border-radius: 2rem;cursor: pointer;background: #0372D2}
.genre_title .genre_item+.genre_item {margin-left:1.25rem}
.genre_title .genre_item:hover,
.genre_title .genre_item.active {color:#0372d2;background:#fff}
.ganre_list .tit {margin-top:0.938rem;color: #d5d5d5;font-size:1.375rem;font-weight:normal;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ganre_list .list_card {display:inline-block;margin:0 1.25rem 2.5rem 0;width:calc(100% - 80% - 1rem)}
.ganre_list .list_card picture {display:block;border-radius:0.5rem;width:100%;max-height:31.25rem;overflow:hidden}
.ganre_list .list_card picture img  {width:100%;height:100%}
.ganre_list .list_card:hover {transform: translate3d(0,-0.75rem,0);transition: transform .3s ease-in-out;cursor:pointer}
.ganre_list .list_card:nth-child(5n) {margin-right:0}
@media screen and (max-width: 768px) {
    .ganre_list .list_card {width:calc(100% - 69% - 0.25rem)}
    .ganre_list .list_card:nth-child(5n) {margin-right:1.25rem}
    .ganre_list .list_card:nth-child(3n) {margin-right:0}
}
</style>