import axios from "axios";

const request = axios.create({
  baseURL: "https://api.themoviedb.org/3/",
  params: {
    api_key: "cb772a50acc4cd6917b12854484b9d91",
    language: "ko-KR",
  },

});
export const movieApi = {
  nowPlaying: () => request.get("movie/now_playing"),
  popular: () => request.get("movie/popular"),
  TopRated: () => request.get("movie/top_rated"),
  genre: (value) =>  request.get(`genre/${value}/list`),
  genreList: (value, page) =>  request.get(`discover/movie?with_genres=${value}&page=${page}`),

  
  trending: (media_type, time_window) =>  request.get(`trending/${media_type}/${time_window}`),

  similar: (value) =>  request.get(`movie/${value}/similar`),
  recommend: (movie_id) =>  request.get(`movie/${movie_id}/recommendations`),
  person : (movie_id) => request.get(`movie/${movie_id}/credits`),
  video : (movie_id) => request.get(`movie/${movie_id}/videos`),
  social: (movie_id) => request.get(`movie/${movie_id}/external_ids`),
  image: (movie_id) => request.get(`movie/${movie_id}/images?&language=fr&include_image_language=fr,null,en`),
  // 언어 바꾸기
  mediaImages : (movie_id) => request.get(`movie/${movie_id}/images?&language=en-US`),
  search: (keyword) =>
    request.get("search/movie", {
      params: {
        query: keyword,
      },
    }),
    movieDetail: (id) =>
    request.get(`movie/${id}`, {
      params: { append_to_response: "videos" },
    }),
    personDetail: (id) =>
    request.get(`person/${id}`, {
      params: { append_to_response: "videos" },
    }),
};