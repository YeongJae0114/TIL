# String 클래스

## 주요 메서드
### 문자열 정보 조회, 검색, 비교, 변환
| 구분 | 리턴 타입 | 메서드 | 설명 |
|------|-----------|--------|------|
| 문자열 길이 | int | length() | 문자열의 길이 |
| 문자열 검색 | char | charAt(int index) | 인덱스 위치의 문자 |
|  | int | indexOf(int ch) | 문자열에 특정한 문자 또는 문자열의 위치를 문자열의 왼쪽부터 끝까지 탐색하여 해당하는 인덱스 값에서 처음 검색된 위치 알려줌 |
|  | int | indexOf(int ch, int fromIndex) | (fromIndex는 검색 시작 위치) |
|  | int | indexOf(String str) |  |
|  | int | indexOf(String str, int fromIndex) |  |
|  | int | lastIndexOf(int ch) | 문자열에 특정한 문자 또는 문자열의 위치를 문자열의 오른쪽부터 시작하여 해당하는 인덱스 값에서 처음 검색된 위치 알려줌 |
|  | int | lastIndexOf(int ch, int fromIndex) | (fromIndex는 검색 시작 위치) |
|  | int | lastIndexOf(String str) |  |
|  | int | lastIndexOf(String str, int fromIndex) |  |
| 문자열 변환 및 결합 | float | String.valueOf(boolean b) | boolean, char, int, long, float, double 값을 문자열로 변환하기 위한 정적 메서드 |
|  | float | String.valueOf(char c) |  |
|  |  float | String.valueOf(int i) |  |
|  | float | String.valueOf(long l) |  |
|  | float | String.valueOf(float f) |  |
|  | float | String.valueOf(double d) |  |
|  | double | concat(String str) | 문자열 연결(String 객체와 + 연산자 동일) |
| 문자열 바이트 배열 변환 | byte[] | getBytes() | 문자열을 byte[]로 변환 (변환할 때 문자 집합(charset) 지정 가능) |
|  | char[] | toCharArray() | 문자열을 char[]로 변환 |

### 문자열 변환
| 구분     | 리턴 타입 | 메서드                                   | 설명                                  |
|----------|-----------|------------------------------------------|--------------------------------------|
| 문자열 소문 | String    | toLowerCase()                            | 영문 문자열 모두 소문자로 변환       |
| 문자열 대문 | String    | toUpperCase()                            | 영문 문자열 모두 대문자로 변환       |
| 문자열 치환 | String    | replace(char oldChar, char newChar)     | oldChar 문자열을 newChar 문자열로 대체하는 문자 |
| 문자열 추출 | String    | substring(int beginIndex)               | beginIndex부터 끝까지의 문자열 추출  |
|          | String    | substring(int beginIndex, int endIndex) | beginIndex부터 endIndex-1 위치까지의 문자열 추출 |

