<template>
  <div class="tile is-ancestor" >
    <div class="tile is-parent">
      <div class="tile is-child">
        <div class="block">
          <label for="gjoremalsliste" class="help" style="font-size: large">Tittel:</label>
          <p class="help is-danger">{{errorMessage}}</p>
          <input id="gjoremalsliste" type="text" class="input" v-model="navn" placeholder="Tittel på gjøremålsliste" />
        </div>

        <br>
        <div class="field-body">
          <label class="help" for="dp"  style="font-size: large">Frist :</label>
          <flatPickr id="dp" v-model="ferdig" :config="{enableTime: false}"></flatPickr>
        </div>
        <br>
        <div class="block">
          <nav class="level">
            <div class="is-pulled-left">
              <button type="button" class="button" style="background-color: orange" v-on:click="validateData">Ferdig</button>
            </div>
            <div class="is-pulled-right">
              <button type="button" class="button is-danger"  v-on:click="avbryt">Avbryt</button>
            </div>
          </nav>
        </div>



      </div>
    </div>
  </div>
</template>

<script>
  import {store} from '@/store'
  import axios from 'axios'
  import flatPickr from 'vue-flatpickr-component';
  import 'flatpickr/dist/flatpickr.css';
  import Modal from '@/components/Modal';
  export default {
    name: "TodoList",
    components: {
      flatPickr, Modal
    },
    data() {
      return {
        navn: '',
        ferdig: new Date(),
        errorMessage: ''
      }
    },
    methods: {

      avbryt(){
        this.$emit("avbryt");
        this.clear();
      },
      clear(){
        this.navn = '';
        this.ferdig = new Date();
        this.errorMessage = '';
      },
      sendListe(){
        let gjoremalsliste =
          {
            navn: this.navn,
            opprettet: new Date(),
            ferdig: new Date(this.ferdig),
            undergruppe_id: store.state.current_group.undergruppe_id
          };
        axios.post('http://localhost:9000/rest/gjoremalsliste/' + store.state.current_group.undergruppe_id, gjoremalsliste).then( response => {
          this.$emit('todoListAdded');
          this.clear();
        }).catch(err => {
          console.log(JSON.stringify(err));
        });
      },
      validateData(){
        this.errorMessage = '';
        if(this.navn === ''){
          this.errorMessage = 'Gjøremålsliste må ha navn/tittel';
        } else{
          this.sendListe();
        }
      }
        /*
      postList() {
        axios.post('http://localhost:9000/rest/gjoremalsliste', this.gjoremalsliste).then( response => {
          this.$emit('todoListAdded');
          this.clear();
        }).catch(err => {
          console.log(err);
        });
      }
      */
    }
  }
</script>

<style scoped>

</style>
