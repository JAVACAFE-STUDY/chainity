<template>
  <b-card header-tag="header" footer-tag="footer">
    <div slot="header">
      <i class="fa fa-align-justify"></i> <strong>Collapse</strong> <small>with <code>v-b-toggle</code> directive</small>
    </div>
    <div>
      <!-- Using modifiers -->
      <b-btn v-b-toggle.collapse class="m-1">Toggle Collapse</b-btn>

      <!-- Using value -->
      <b-btn v-b-toggle="'collapse'" class="m-1">Toggle Collapse</b-btn>

      <!-- element to collapse -->
      <b-collapse id="collapse">
        <div>
          <b-form inline>
            <label class="sr-only" for="inlineFormInputName2">Name</label>
            <b-input class="mb-2 mr-sm-2 mb-sm-0" id="inlineFormInputName2" placeholder="Jane Doe" />
            <label class="sr-only" for="inlineFormInputGroupUsername2">Username</label>
            <b-input-group left="@" class="mb-2 mr-sm-2 mb-sm-0">
              <b-input id="inlineFormInputGroupUsername2" placeholder="Username" />
            </b-input-group>
            <b-form-checkbox class="mb-2 mr-sm-2 mb-sm-0">Remember me</b-form-checkbox>
            <b-button variant="primary">Save</b-button>
          </b-form>
        </div>
      </b-collapse>
    </div>
  </b-card>
</template>

<script>
export default {
  name: 'collapses',
  data () {
    return {
      showCollapse: true
    }
  }
}
</script>
