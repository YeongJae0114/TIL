## Redis 기본 명령어
자료 구조(string, list, hash, Set, sorted Set 등)를 설명하고, 수없이 많은 명령어(SET, GET, EXISTS, DEL, HSET 등)가 있지만, 
빠른 실습을 위해서 실습을 위주로 주요 사용 방법만 배워보자. 
### 데이터(Key, Value) 저장하기
```bash
# set [key 이름] [value]
$ set jaeseong:name "jaeseong park" # 띄워쓰기 해서 저장하려면 쌍따옴표로 묶어주면 됨
$ set jaeseong:hobby soccer
```

### 데이터 조회하기 (Key로 Value 값 조회하기)
```bash
# get [key 이름]
$ get jaeseong:name
$ get jaeseong:hobby

$ get pjs:name # 없는 데이터를 조회할 경우 (nil)이라고 출력됨
```


### 저장된 모든 key 조회하기
```bash
$ keys *
```

### 데이터 삭제하기 (Key로 데이터 삭제하기)
```bash
# del [key 이름]
$ del jaeseong:hobby

$ get jaeseong:hobby # 삭제됐는 지 확인
```

### 데이터 저장 시 만료시간(TTL) 정하기
- 레디스는 RDBMS와는 다르게 데이터 저장 시 만료시간을 설정할 수 있다. 즉, 영구적으로 데이터를 저장하지 않고 일정 시간이 되면 데이터가 삭제되도록 셋팅할 수 있다. 
```bash
# set [key 이름] [value] ex [만료 시간(초)]
$ set jaeseong:pet dog ex 30
```

### 만료시간(TTL) 확인하기
```bash
# ttl [key 이름]
# 만료 시간이 몇 초 남았는 지 반환
# 키가 없는 경우 -2를 반환
# 키는 존재하지만 만료 시간이 설정돼 있지 않은 경우에는 -1을 반환
$ ttl jaeseong:pet 
$ ttl jaeseong:name
$ ttl pjs:name
```

### 모든 데이터 삭제하기
```bash
$ flushall
```
