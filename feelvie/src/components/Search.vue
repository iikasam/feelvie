<template>
    <section class="search_container">
        <form>
            <label class="search_input" for="search_input">
                <input id="search_input" type="text" @keyup="autoSearch($event)"
                    onkeypress="if(event.keyCode=='13'){event.preventDefault()}"
                    placeholder="TV프로그램, 영화 제목 및 출연진으로 검색해보세요" class="search_txt">
                <button type="button" class="icon_search">
                    <span class="blind">검색</span>
                </button>
            </label>
        </form>

        <div class="search_none" v-if="searchNone">
            검색결과가 없습니다.
        </div>

        <ul class="search_list" v-if="movieList">
            <li v-for="item in movieList" :key="item.id" @click="goDetail(item.media_type, item.id)" class="list_card">
                <picture>
                    <img :src="image(item.poster_path)" alt="">
                </picture>
                <p class="tit">{{ this.media_type == "movie" ? item.title : item.name }}</p>
                <p class="tit" v-if="this.movieListName == searchResult">{{ searchResult }}</p>
            </li>
        </ul>
    </section>
</template>

<script>
import { movieApi } from '../utils/axios';
import { debounce } from 'lodash'

export default {
    name: 'Search_',
    data() {
        return {
            movieList: '',
            images: ['image_none.png'],
            searchResult: '',
            searchNone: false
        };
    },
    methods: {
        // 값을 입력하고 0.1초 뒤 api 호출
        autoSearch: debounce(async function (e) {
            const searchText = e.target.value;
            // 공백이 없거나 달라도 검색되게 공백제거
            const searchResult = searchText.replace(/(\s*)/g, "");
            // 검색결과
            const { data } = await movieApi.search(searchResult);
            this.movieList = data.results;
            this.search_photo = this.movieList.map(key => key.poster_path);
            // 검색결과가 없을 때
            this.searchNone = this.movieList.length === 0 ? true : false;
            this.movieListName = this.movieList.map(key => key.title)
        }, 100),
        // 이미지
        image(img) {
            if (img == undefined) {
                // 이미지 없을 때
                return require(`@/assets/${this.images}`)
            } else {
                return `https://image.tmdb.org/t/p/w300/${img}`
            }
        },
        // 클릭 시 상세페이지로
        goDetail(type, id) {
            this.$router.push(`/${type}/${id}`);
        },
    }
}
</script>

<style>
.search_container {margin-top:12.5rem}
.search_container .search_input {position:relative;display:block;margin:0 15.625rem;border-bottom:2px solid #fff}
.search_container .search_input .search_txt {width:calc(100% - 3.75rem);color:#eee;font-size:1.75rem;font-weight:bold;border:none;background:none;font-family:'Noto Sans KR', sans-serif}
.search_container .search_input .icon_search {position:absolute;right:0;bottom:0;width:3.125rem;height:3.125rem;background:none}
.search_container .search_input .icon_search:before {display:inline-block;width:1.875rem;height:1.875rem;;background:url("data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' fill='none' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Crect width='32' height='32' fill='url(%23pattern0)'/%3E%3Cdefs%3E%3Cpattern id='pattern0' patternContentUnits='objectBoundingBox' width='1' height='1'%3E%3Cuse xlink:href='%23image0_12_305' transform='scale(0.03125)'/%3E%3C/pattern%3E%3Cimage id='image0_12_305' width='32' height='32' xlink:href='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAA7EAAAOxAGVKw4bAAAB2klEQVRYhe2WO0vEQBSF7wRLSwmyyGItVmJtoY1YiMgW1oIoYiEisv9EtrCwsLMVK3+F4GIhYieoWIjI4uOzmBHD3Ukyk6zaeCHFTvac881kXkYKCkhFpCUicyIyISKpe3UvIhciciYix8aY2yKf6AJSoAP0KK8ecAA0BhW+ANwFBOt6BJbqhq8C7xXCv+od2KjTc1/4FbAHTAMj7pkCdoHLHIjl2PCU/mF/BdrAUIFuCNihf648EjMnsBNOhy9G6Oc9EIeh4tQjbgfTf/tsezoxFiLcVMKromEv8EmArvLaKdMlYjeZbHWMMW+xAMaYDxHZV83au7881NOx4RmvSeV1HSJ6UKKRGgDDyuu5TJNUDcupj1hBIvZgyVazBsC4+q29vQAXqm22BoDWam8vwJlqW6u6DEVkXTVrb69w1LMRla5fj4/eT16BsM+JPc+z1QPmI8JngRflcRRD38AeIBpi2w1tni5xPdfhT8G9z5gt4T+Ouw5kErvOh4EJYAs49/z/a/hXogAcxEYORJWqDLFM/+cIqScXOhCIBnDoMczr6RHQBFYGBuFAxrA3nhPgGnh2zw1wir2WNZVmsBAVwf8h/iFCIVp/DVF+ZfthiO6vAjiIFnZP6QIzn9TA/Qx6PEfbAAAAAElFTkSuQmCC'/%3E%3C/defs%3E%3C/svg%3E%0A") center / 100% no-repeat;content:''}

.search_container .search_list {margin:3.888rem}
.search_container .search_list .tit {margin-top:0.938rem;color: #d5d5d5;font-size:1.375rem;font-weight:normal;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.search_container .search_list .list_card {display:inline-block;margin:0 1.25rem 2.5rem 0;width:calc(100% - 80% - 1rem);vertical-align:top}
.search_container .search_list .list_card picture {display:block;border-radius:0.5rem;width:100%;max-height:31.25rem;overflow:hidden}
.search_container .search_list .list_card picture img  {width:100%;height:100%}
.search_container .search_list .list_card:hover {transform: translate3d(0,-0.75rem,0);transition: transform .3s ease-in-out;cursor:pointer}
.search_container .search_list .list_card:nth-child(5n) {margin-right:0}

.search_container .search_none {padding-top:20rem;display:flex;align-items:center;justify-content:center;color:#757575;font-size:1.75rem;font-weight:bold}

@media screen and (max-width: 768px) {
    .search_container .search_input {margin:5rem;padding:1rem 0}
    .search_container .search_input .search_txt {font-size:1rem}

    .search_container .search_list .list_card {width:calc(100% - 68% - 0.25rem)}
    .search_container .search_list .list_card:nth-child(5n) {margin-right:1.25rem}
    .search_container .search_list .list_card:nth-child(3n) {margin-right:0}
}
</style>
