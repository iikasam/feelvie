<template>
    <div class="container">
        <section class="person_detail">
            <picture>
                <img :src="image(personDetail.profile_path)" alt="Image 2">
            </picture>
            <div class="profile_info">
                <div class="profile_name">
                    <h1 v-if="personDetail.also_known_as"> {{ personDetail.also_known_as[1] }}</h1>
                    <ul class="social_links">
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
                            <a :href="`https://instargram.com/${this.instagramLink}`" class="instargram"
                                target="_blank">
                                <span class="blind">인스타그램</span>
                            </a>
                        </li>
                    </ul>
                </div>

                <div class="profile_desc">
                    <dl>
                        <dt>생년월일</dt>
                        <dd>{{ personDetail.birthday }}</dd>
                    </dl>
                    <dl>
                        <dt>성별</dt>
                        <dd>{{ (personDetail.gender == 2) ? '남자' : '여자' }}</dd>
                    </dl>
                </div>

                <!-- 이번 주 가장 많이 찾아 본 컨텐츠 -->
                <div class="title">
                    <h2>유명 작품</h2>
                </div>

                <ItemList :movieList="knownWork" :type="list_type" :title="title" :photo="knownWork_photo"></ItemList>


                <!-- 작품 리스트 -->
                <div class="work">
                    <div class="work_top">
                        <h3>필모그래피</h3>
                        <ul class="type_list">
                            <li>
                                <button type="button" :class="{active : activatedTarget=='a'}" @click="ganreTab(this.movieList, 'movie', 'a')">영화</button>
                            </li>
                            <li>
                                <button type="button" :class="{active : activatedTarget=='b'}" @click="ganreTab(this.tvList, 'tv', 'b')">TV</button>
                            </li>
                        </ul>
                    </div>
                    
                    <ul class="work_list">
                        <template v-for="work in filmoList" :key="work.id">
                            <li v-if="work.title || work.character && work.name" @click="goDetail(list_type, work.id)">
                                <span class="date">{{ work.release_date == null ? work.first_air_date.substr(0, 4) : work.release_date.substr(0, 4) }}</span>
                                <p class="tit">
                                    {{  work.name == null ? work.title : work.name }}
                                </p>
                                <span class="char" v-if="work.character">
                                    {{ work.character }} 역
                                </span>
                            </li>
                        </template>

                    </ul>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
import ItemList from './ItemList.vue'
import { movieApi } from '../utils/axios';

export default {
    name: 'PersonDetail_',
    data() {
        return {
            personDetail: {},
            personWork: {},
            personSocial: {},
            movieList: [],
            filmoList: [],
            tvList: [],
            list_type: 'movie',
            knownWork_photo: '',
            facebookLink: {},
            twitterLink: {},
            instagramLink: {},
            activatedTarget: 'a'
        };
    },
    methods: {
        // 포스터
        image(img) {
            return `https://image.tmdb.org/t/p/w300/${img}`
        },
        // 영화상세
        goDetail(type, id) {
            this.$router.push(`/${type}/${id}`);
        },
        async ganreTab(id, type, tag) {
            this.filmoList = id;
            this.list_type = type;
            this.activatedTarget = tag;
            console.log(this.filmoList)
        }
    },
    async mounted() {
        // 인물 ID값에 따른 정보
        const { id } = this.$route.params;

        // 인물 정보
        const personDetail = await movieApi.personDetail(id);
        this.personDetail = personDetail.data;

        // 영화
        const personWork = await movieApi.personWork(id);
        this.personWork = personWork.data;

        // 인기있는 작품 (정렬 후)
        const knownWork = [...this.personWork.cast].sort(function (a, b) { return b.vote_average - a.vote_average }).slice(0, 10);
        this.knownWork = knownWork
        this.knownWork_photo = this.knownWork.map(key => key.poster_path)

        // 영화 날짜순으로 정렬
        this.movieList = this.personWork.cast.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
        this.filmoList = this.movieList;
        console.log(this.filmoList)

        // Tv 날짜순으로 정렬
        const personTv = await movieApi.personTv(id);
        this.tvList = personTv.data.cast.sort((a, b) => new Date(b.release_date) - new Date(a.release_date))
        console.log(this.tvList)

        // 소셜
        const personSocial = await movieApi.personSocial(id);
        this.facebookLink = personSocial.data.facebook_id
        this.twitterLink = personSocial.data.twitter_id
        this.instagramLink = personSocial.data.instagram_id;
        
    },
    components: {
        ItemList
    }
}
</script>

<style>
.container {position: -webkit-sticky;position:sticky;top:0;bottom:0;left:0}
.person_detail {display:flex;width:100%;padding:9.375rem 4.375rem 4.375rem;;color: #fff;overflow:hidden}
.person_detail picture {position:fixed;display:block;width:18.75rem}
.person_detail picture img {width:100%;border-radius:0.5rem}
.person_detail .profile_info {margin-left:23.125rem;overflow:hidden}
.person_detail .profile_info .item_container {padding:0}
.person_detail .profile_info .profile_name {display:flex;align-items:center;margin-bottom:3.125rem}
.person_detail .profile_info .profile_name h1 {font-size:2.813rem;font-weight:bold}
.person_detail .profile_info .profile_desc dl {display:inline-block;margin-bottom:3.125rem;vertical-align:top;font-size:1.75rem}
.person_detail .profile_info .profile_desc dl+dl {margin-left:3.125rem}
.person_detail .profile_info .profile_desc dt {margin-bottom:0.938rem;font-weight:bold}
.person_detail .profile_info .profile_name .social_links {display:flex;align-items:center;margin-left:3.125rem}
.person_detail .profile_info .profile_name .social_links li {display: flex;align-items: center;justify-content: center;width:4.5rem;height:4.5rem;border-radius: 50%;background: #fff}
.person_detail .profile_info .profile_name .social_links li+li {margin-left:0.938rem}
.person_detail .profile_info .profile_name .social_links li a {width:3.125rem;height:3.125rem;background: #000}
.person_detail .profile_info .profile_name .social_links li a.facebook {background: url(./../assets/icon_facebook.png) center no-repeat}
.person_detail .profile_info .profile_name .social_links li a.tritter {background: url(./../assets/icon_twitter.png) center no-repeat}
.person_detail .profile_info .profile_name .social_links li a.instargram {background: url(./../assets/icon_instagram.png) center no-repeat}
.work {padding-top:4.375rem}
.work .work_list li{display:flex;align-items:center;font-size:1.25rem;cursor:pointer}
.work .work_list li:hover .tit {color:#4876ef}
.work .work_list li+li {margin-top:0.938rem}
.work .work_list li .date {padding:2px 6px;margin-right:15px}
.work .work_list li .char {max-width:30%;margin-left:auto;text-align:right}
.work .work_list li p {max-width:50%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.work_top {display:flex;align-items:center;margin-bottom:1.875rem}
.work_top h3 {font-size:2rem;font-weight:bold}
.type_list {display:flex;align-items:center;margin-left:0.938rem}
.type_list li+li {margin-left:0.625rem} 
.type_list li button {display:flex;align-items:center;height:2.5rem;padding:0 0.938rem;color:#fff;font-size:1.375rem;border:1px solid #fff;border-radius:3.125rem;background:#000}
.type_list li button.active {color:#000;border-color:#000;background:#fff}


@media screen and (max-width: 768px) {
    .person_detail {display:block;padding:9.375rem 2.5rem 2.5rem}
    .person_detail picture {position:relative;width:15rem;margin:0 auto}
    .person_detail .profile_info {margin-left:0}
    .person_detail .profile_info .profile_name {margin:0.938rem 0;justify-content:center}
    .person_detail .profile_info .profile_desc {text-align:center}
}

</style>

