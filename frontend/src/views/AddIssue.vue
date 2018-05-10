<template>
  <b-row>
    <b-col sm="8">
      <b-card>
        <div slot="header">
          <strong>이슈 등록</strong>
        </div>
        <b-form-group>
          <label for="title">제목</label>
          <b-form-input type="text" id="title"></b-form-input>
        </b-form-group>
        <b-form-group>
          <label for="content">내용</label>
          <b-form-input type="textarea"></b-form-input>
        </b-form-group>
        <b-form-group>
          <label for="due_date">마감일</label>
          <b-form-input type="text" id="due_date"></b-form-input>
        </b-form-group>
        <b-row>
          <b-col sm="6">
            <b-form-group>
              <label for="count">인원수</label>
              <b-form-input type="text" id="count"></b-form-input>
            </b-form-group>
          </b-col>
          <b-col sm="6">
            <b-form-group>
              <label for="rewards">보상금액</label>
              <b-form-input type="text" id="rewards"></b-form-input>
            </b-form-group>
          </b-col>
        </b-row>
        <b-form-group>
          <label for="assignee">Assignee</label>
          <b-form-input type="text" id="assignee"></b-form-input>
        </b-form-group>
        <b-button variant="primary">등록</b-button>
      </b-card>
    </b-col>
  </b-row>
</template>
