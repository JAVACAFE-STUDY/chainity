<template>
  <div class="animated fadeIn">
    <p class="text-info">Hello World</p>
    <vue-tags-input
      class="tags-input"
      v-model="tag"
      :tags="tags"
      :allow-edit-tags="true"
      :add-only-from-autocomplete="true"
      @tags-changed="newTags => tags = newTags"
      :autocomplete-items="items">
      <div slot="tagCenter" slot-scope="props">
        <span
          @click="props.performOpenEdit(props.index)"
          v-if="!props.edit">{{ props.tag.text }}
        </span>
        <div class="inputs" v-else>
          <select
            v-model="props.tag.text"
            @change="props.validateTag(props.index)">
            <option v-for="(animal, index) in animals" :key="index">{{ animal }}</option>
          </select>
          <i class="material-icons" @click="props.performSaveTag(props.index)">check</i>
        </div>
      </div>
    </vue-tags-input>
  </div>
</template>

<script>
import VueTagsInput from '@johmun/vue-tags-input';

export default {
  name: 'dashboard',
  components: {VueTagsInput},
  data () {
    return {
     animals: [
        'Lion', 'Turtle', 'Rabbit', 'Frog', 'Squirrel', 'Owl', 'Bee',
      ],
      tag: '',
      tags: []
    }
  },
  computed: {
    items() {
      return this.animals
        .filter(a => new RegExp(this.tag, 'i').test(a))
        .map(a => ({ text: a }));
    }
  }
}
</script>
