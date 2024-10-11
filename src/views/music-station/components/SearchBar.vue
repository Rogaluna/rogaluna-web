<template>
  <div class="component-container">
    <rogaluna-list
      horizontal
      :items="preButtons"
      :item-style="{border: 0, padding: 0}">
      <template v-slot:item="{ item }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn 
              icon
              v-bind="attrs"
              v-on="on"
              @click="item.onclick">
              <svg class="__icon__s"
                aria-hidden="true"
                icon
                style="font-size: smaller;">
                <use :xlink:href="item.icon"></use>
              </svg>
            </v-btn>
          </template>
          <span>{{ item.text }}</span>
        </v-tooltip>
      </template>
    </rogaluna-list>

    <div class="searchbar-container" style="flex-grow: 1;">
      <v-text-field
        ref="editableInput"
        v-model="searchQuery"
        clearable
        flat
        @keyup.enter="performSearch"
      >
        <div
          slot="append"
        >
          <svg class="__icon__s"
            aria-hidden="true"
            icon
            style="font-size: smaller;">
            <use xlink:href="#rogaluna-icon-search1"></use>
          </svg>
        </div>
      </v-text-field>
    </div>

    <rogaluna-list
      horizontal
      :items="postButtons"
      :item-style="{border: 0, padding: 0}">
      <template v-slot:item="{ item }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn 
              icon 
              v-bind="attrs"
              v-on="on"
              @click="item.onclick">
              <v-badge
                dot
                :value="item.value"
                color="red"
                overlap>
                <svg class="__icon__s"
                  aria-hidden="true"
                  icon
                  style="font-size: smaller;">
                  <use :xlink:href="item.icon"></use>
                </svg>
              </v-badge>
            </v-btn>
          </template>
          <span>{{ item.text }}</span>
        </v-tooltip>
      </template>
    </rogaluna-list>
  </div>
</template>

<script>
import RogalunaList from '@/plugins/rogaluna-widgets/widgets/layout/RogalunaList.vue';

export default {
  components: {
    RogalunaList
  },
  props: {
    preButtons: {
      type: Array,
      default() {
        return [];
      },
    },
    postButtons: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      searchQuery: "",
    };
  },
  methods: {
    performSearch() {
      if (this.searchQuery.trim() !== "") {
        this.$emit("search", this.searchQuery);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.component-container {
  display: flex;
  align-items: center;
  background-color: none;
  border-width: 0px 0px 1px 0px;
  border-color: var(--split-color);
  border-style: solid;
  padding: 5px;

  .searchbar-container {
    .v-input {
      padding: 10px;
      margin: 0px;

      ::v-deep .v-input__control {
        .v-input__slot {
          margin: 0 !important;
          padding-bottom: 1px;

          input {
            font-size: 14px !important;
            padding: 0px !important;
          }
        }

        .v-text-field__details {
          min-height: 0px !important;
          height: 0px !important;
        }
      }
    }
  }
}
</style>
