<template>
  <div class="control has-icons-left">
    <div class="select is-rounded">
      <select v-model="currentGroup">
        <option v-for="group in groups" :value="group">
          <template v-if="group.default_gruppe"><span style="font-weight: bold">{{group.kollektiv_navn}}</span></template>
          <template v-else>&nbsp; -  {{group.navn}}</template>
        </option>
      </select>
    </div>
    <div class="icon is-small is-left">
      <i class="fa fa-users fa-lg"></i>
    </div>
  </div>
</template>
<script>

  import axios from 'axios';
  import {store} from '../store';

  export default {
    asyncComputed:{
      groups: {
        get(){
          let groups;
          let a = store.state.updateGroups;
          console.log(a + 'updating group selector');
          console.log('loading groups for user ' + store.state.current_user.epost);
          return axios.get('http://localhost:9000/rest/undergrupperForBruker/' + store.state.current_user.bruker_id).then(response => {
            groups = response.data;
            return groups;
          }).catch(err => {
            console.log(err);
          });
        },
        watch(){
          store.state.updateGroups;
        }
      }
    },
    computed: {
        currentGroup:{
          get(){
              return store.state.current_group;
          },
          set(value){
                store.commit('current_group', value);
          }
        }
    }
  };
</script>
<style></style>
