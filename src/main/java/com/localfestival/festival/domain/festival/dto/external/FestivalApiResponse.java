package com.localfestival.festival.domain.festival.dto.external;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

/**
 * 전국문화축제표준데이터 API JSON 응답 DTO
 * 공공데이터포털 - 전국문화축제표준데이터
 */
@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class FestivalApiResponse {

    @JsonProperty("response")
    private Response response;

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Response {
        @JsonProperty("header")
        private Header header;

        @JsonProperty("body")
        private Body body;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Header {
        @JsonProperty("resultCode")
        private String resultCode;

        @JsonProperty("resultMsg")
        private String resultMsg;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Body {
        @JsonProperty("items")
        private List<FestivalItem> items;

        @JsonProperty("numOfRows")
        private Integer numOfRows;

        @JsonProperty("pageNo")
        private Integer pageNo;

        @JsonProperty("totalCount")
        private Integer totalCount;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class FestivalItem {
        @JsonProperty("fstvlNm")
        private String fstvlNm;  // 축제명

        @JsonProperty("opar")
        private String opar;  // 개최장소

        @JsonProperty("fstvlStartDate")
        private String fstvlStartDate;  // 축제시작일자

        @JsonProperty("fstvlEndDate")
        private String fstvlEndDate;  // 축제종료일자

        @JsonProperty("fstvlCo")
        private String fstvlCo;  // 축제내용

        @JsonProperty("mnnstNm")
        private String mnnstNm;  // 주관기관명

        @JsonProperty("auspcInsttNm")
        private String auspcInsttNm;  // 주최기관명

        @JsonProperty("suprtInsttNm")
        private String suprtInsttNm;  // 후원기관명

        @JsonProperty("phoneNumber")
        private String phoneNumber;  // 전화번호

        @JsonProperty("homepageUrl")
        private String homepageUrl;  // 홈페이지주소

        @JsonProperty("relateInfo")
        private String relateInfo;  // 관련정보

        @JsonProperty("rdnmadr")
        private String rdnmadr;  // 소재지도로명주소

        @JsonProperty("lnmadr")
        private String lnmadr;  // 소재지지번주소

        @JsonProperty("latitude")
        private String latitude;  // 위도

        @JsonProperty("longitude")
        private String longitude;  // 경도

        @JsonProperty("referenceDate")
        private String referenceDate;  // 데이터기준일자

        @JsonProperty("instt_code")
        private String insttCode;  // 제공기관코드

        @JsonProperty("instt_nm")
        private String insttNm;  // 제공기관기관명
    }

    // 편의 메서드
    public List<FestivalItem> getData() {
        if (response != null && response.getBody() != null) {
            return response.getBody().getItems();
        }
        return null;
    }

    public Integer getCurrentCount() {
        List<FestivalItem> items = getData();
        return items != null ? items.size() : 0;
    }

    public Integer getTotalCount() {
        if (response != null && response.getBody() != null) {
            return response.getBody().getTotalCount();
        }
        return 0;
    }

    public boolean isSuccess() {
        return response != null
                && response.getHeader() != null
                && "00".equals(response.getHeader().getResultCode());
    }
}