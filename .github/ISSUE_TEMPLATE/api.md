---
name: API
about: Describe this issue template's purpose here.
title: "[API]"
labels: "\U0001F6E2 BE, \U0001F32A API"
assignees: ''

---

## 개요
- 로그인 처리 API

## URL
- `/users/login`

## Method
- `POST`: `로그인을 처리하고 토큰 발급`

## Query parameters
- `key`: `value`

## Header
- `Authorization`: `token`

## Body
- `username`: `string`
- `password`: `string`

## Response
- `token`: `string`
- `success`: `boolean`
- `code`: `int`

## Error
| 상태 코드  | 오류 메시지  | 설명 |
|:-----:|:------:|:-----:|
| 400 | Missing username or password | 아이디 혹은 비밀번호 누락 시 발생합니다. |
| 401 | Unauthorized  | 유효한 토큰을 header에 포함하지 않은 경우 발생합니다. |
| 403 | Forbidden | 다른 사용자의 덧글을 수정하려는 경우 발생합니다. |
| 404 | Not Found | 해당 id의 issue가 존재하지 않는 경우 발생합니다. |
| 409 | Conflict | 해당 username의 사용자가 이미 존재하는 경우 / 이미 추가한 reaction을 추가하는 경우 / 이미 삭제한 reaction을 삭제하는 경우 발생합니다. |
| 500 | Internal Server Error | 서버에 문제가 생긴 경우 발생합니다. |
