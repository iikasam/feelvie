<template>
  <header class="wrap_header" :class="{fixed: scrollPosition > 100}">
    <div class="header_container">
      <div class="navigation">
        <router-link to="/" class="logo">
          <img src="https://www.tving.com/img/tving-new-logo-pc.svg" alt="">
        </router-link>
        <ul class="menu">
          <li>
            <router-link :to="{ name: 'link', params: { linkValue: 'movie' }}">영화</router-link>
          </li>
          <li>
            <router-link :to="{ name: 'link', params: { linkValue: 'tv' }}">TV 프로그램</router-link>
          </li>
          <li>
            <router-link to="/person/">인물</router-link>
          </li>
        </ul>
      </div>

      <router-link to="/search" class="search">
        <span class="blind">검색</span>
      </router-link>
    </div>
  </header>
</template>
<script>
export default {
  name: 'Header_',
  data(){
        return{
            scrollPosition: null
        }
    },
    methods: {
        updateScroll(){
           this.scrollPosition = window.scrollY
        }
    },
    mounted(){
        window.addEventListener('scroll', this.updateScroll);
    },
}
</script>

<style>
.wrap_header {position:fixed;top:0;width:100%;z-index:500;backdrop-filter: blur(0px);
background-image: linear-gradient(to bottom,rgba(0,0,0,0.7),rgba(0,0,0,0));
  color: rgba(255,255,255,1);
  -webkit-transition: backdrop-filter 0.3s linear,background-color 0.3s linear;
  transition: backdrop-filter 0.3s linear,background-color 0.3s linear;
  background-color: rgba(0,0,0,0);}


  .wrap_header.fixed {transform: translate3d(0px, 0px, 0px);
    background-image: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0));
    color: rgb(255, 255, 255);
    transition: backdrop-filter 0.3s linear 0s, background-color 0.3s linear 0s;
    backdrop-filter: blur(30px);
    background-color: rgba(0, 0, 0, 0.7);}
.wrap_header .header_container {padding:1.25rem 3.888rem;display:flex;align-items:center;justify-content:space-between;}
.wrap_header .navigation {display:flex;align-items:center}
.wrap_header .navigation img {width:6rem}
.wrap_header .menu {display:flex;align-items:center;margin-left:2.188rem}
.wrap_header .menu li a {color:#fff;font-size:1.625rem;font-weight:bold;line-height:1.25rem}
.wrap_header .menu li+li {margin-left:20px}
.wrap_header .search {display:flex;align-items:center;justify-content:center;width:3.125rem;height:3.125rem}
.wrap_header .search:before {display:inline-block;width:2rem;height:2rem;background:url("data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' fill='none' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Crect width='32' height='32' fill='url(%23pattern0)'/%3E%3Cdefs%3E%3Cpattern id='pattern0' patternContentUnits='objectBoundingBox' width='1' height='1'%3E%3Cuse xlink:href='%23image0_12_305' transform='scale(0.03125)'/%3E%3C/pattern%3E%3Cimage id='image0_12_305' width='32' height='32' xlink:href='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAA7EAAAOxAGVKw4bAAAB2klEQVRYhe2WO0vEQBSF7wRLSwmyyGItVmJtoY1YiMgW1oIoYiEisv9EtrCwsLMVK3+F4GIhYieoWIjI4uOzmBHD3Ukyk6zaeCHFTvac881kXkYKCkhFpCUicyIyISKpe3UvIhciciYix8aY2yKf6AJSoAP0KK8ecAA0BhW+ANwFBOt6BJbqhq8C7xXCv+od2KjTc1/4FbAHTAMj7pkCdoHLHIjl2PCU/mF/BdrAUIFuCNihf648EjMnsBNOhy9G6Oc9EIeh4tQjbgfTf/tsezoxFiLcVMKromEv8EmArvLaKdMlYjeZbHWMMW+xAMaYDxHZV83au7881NOx4RmvSeV1HSJ6UKKRGgDDyuu5TJNUDcupj1hBIvZgyVazBsC4+q29vQAXqm22BoDWam8vwJlqW6u6DEVkXTVrb69w1LMRla5fj4/eT16BsM+JPc+z1QPmI8JngRflcRRD38AeIBpi2w1tni5xPdfhT8G9z5gt4T+Ouw5kErvOh4EJYAs49/z/a/hXogAcxEYORJWqDLFM/+cIqScXOhCIBnDoMczr6RHQBFYGBuFAxrA3nhPgGnh2zw1wir2WNZVmsBAVwf8h/iFCIVp/DVF+ZfthiO6vAjiIFnZP6QIzn9TA/Qx6PEfbAAAAAElFTkSuQmCC'/%3E%3C/defs%3E%3C/svg%3E%0A") center / 100% no-repeat;content:''}
@media screen and (max-width: 768px) {
  .wrap_header .header_container {padding:1.25rem 2rem}
}
</style>
