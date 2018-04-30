Shortening URL

## Shortening URL 이란

Shortening URL이란 bitly나 google URL Shortener 등 너무 긴 URL을 매우 짧은 URL로 변환시켜서 짧은 URL로 접근해도 원래의 사이트로 접근할 수 있는 기능을 수행하는 서비스입니다.

이를 모방하여 만든 프로젝트이며 Base62를 이용하여 간단하게 제작하였습니다.



## 기능

- 메인 화면

![메인 화면](https://raw.githubusercontent.com/Crazy0416/shorteningURL/master/resource/indexPage.png)

- url shortening

![url shortening](https://raw.githubusercontent.com/Crazy0416/shorteningURL/master/resource/shortResult.png)

- 원래 url 리턴

![원래 url 리턴](https://raw.githubusercontent.com/Crazy0416/shorteningURL/master/resource/originalUrlResult.png)

- shorten url로 방문할 시 count 올림

![visit count](https://raw.githubusercontent.com/Crazy0416/shorteningURL/master/resource/VisitCountResult.png)



## Dependency

- node.js
- mysql
- config/db_config.json (mysql connect 정보)
- config/ip_config.json (호스트 정보. 이 데이터를 바탕으로 리다이렉트 할 주소 반환)



## Shortening 알고리즘

간단히 shorten할 Url이 들어오는 순서대로 index를 부여하고 그 인덱스를 62진수로 변환하여 shorten Url로 반환합니다. Shorten Url 서버에 요청하면 다시 index로 변환하여 데이터베이스의 index가 가리키는 원래의 주소로 redirect 시켜줍니다.



## Config 디렉토리

- config/ip_config.json 정보

```javascript
{
    "host": "<호스트, 서버ip:port>"
}
```

- config/db_config.json 정보

```javascript
{
    "host": "<mysql host>",
    "user": "<mysql user>",
    "password": "<mysql password>",
    "database": "<mysql에 저장할 database 이름>"
}
```



## mysql 테이블 정보

- url 테이블

| 컬럼      | 타입          | 특성          | 설명                 |
| --------- | ------------- | ------------- | -------------------- |
| url_id    | INT           | PK, NN, AI    | url 인덱스, 자동증가 |
| o_url     | VARCHAR(2083) | NN            | 오리지널 url         |
| visit_cnt | INT           | NN, default 0 | 방문 횟수            |

※ 없으면 새로 생성해줘야하는 데 아직 처리 못함