<template>
  <div class="app flex-row align-items-center">
    <div class="container">
      <b-row class="justify-content-center">
        <b-col md="6" sm="8">
          <b-card no-body class="mx-4">
            <b-card-body class="p-4">
              <b-form novalidate="novalidate" class="was-validated" @submit="onSubmit">
                <h1 class="text-center">회원가입 완료</h1>
                <span>회원 가입이 완료되었습니다. 시스템 관리자의 승인 후 이용하실 수 있습니다.</span>
                <br/>
                <span>승인 완료 시 등록하신 메일로 안내를 드립니다.</span>
                <br/>
                <span>감사합니다.</span>
                <br/><br/>
                <p class="text-muted">Q. 왜 승인 절차가 필요 할까요?</p>
                <!-- TODO -->
                <!-- <b-button type="submit" variant="success" block>Create Account</b-button> -->
              </b-form>
            </b-card-body>
          </b-card>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>

export default {
  name: 'RegisterComplete'
}
</script>
