<template>
  <div :class="`floatingButton floatingButton-${buttonType}`">
    <svg v-if="buttonType === 'primary'" width="10" height="15" viewBox="0 0 10 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M5.26646 0C4.11007 0 2.97159 0.332247 2.11424 1.07477C1.24575 1.82695 0.715692 2.95757 0.715698 4.44416L1.7157 4.44416C1.71569 3.21248 2.14503 2.37102 2.76892 1.83068C3.40396 1.2807 4.29087 1 5.26646 1C6.22411 1 7.01766 1.31022 7.56658 1.81433C8.11209 2.3153 8.44412 3.03252 8.44412 3.91117C8.44412 4.57809 8.29859 5.08715 8.03638 5.51962C7.76985 5.95922 7.36335 6.35178 6.79142 6.75317C5.94937 7.34412 5.3471 7.85818 4.97687 8.52782C4.60304 9.20399 4.49996 9.97512 4.49996 11H5.49996C5.49996 10.0249 5.60309 9.46192 5.85203 9.01167C6.10457 8.55488 6.54164 8.15015 7.36587 7.57171C8.00073 7.12616 8.52697 6.63928 8.89148 6.03807C9.26032 5.42974 9.44412 4.73663 9.44412 3.91117C9.44412 2.76444 9.00332 1.77607 8.24299 1.0778C7.48607 0.382673 6.44079 0 5.26646 0ZM4.99986 13.15C4.53042 13.15 4.14986 13.5306 4.14986 14C4.14986 14.4694 4.53042 14.85 4.99986 14.85C5.46931 14.85 5.84986 14.4694 5.84986 14C5.84986 13.5306 5.46931 13.15 4.99986 13.15Z" fill="white"/>
    </svg>
    <svg v-else width="18" height="15" viewBox="0 0 18 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M3.79833 10.8106L3.55417 10.3118C3.13805 9.46168 2.90473 8.50882 2.90473 7.5C2.90473 3.92494 5.85327 1 9.52377 1C13.1943 1 16.1428 3.92494 16.1428 7.5C16.1428 11.0751 13.1943 14 9.52377 14C8.47645 14 7.48898 13.7618 6.6118 13.339L6.34711 13.2115L6.05549 13.2473L1.95996 13.7513L3.50393 11.2815L3.79833 10.8106ZM0.682356 13.9085L0 15L1.27761 14.8428L6.17761 14.2399C7.18768 14.7267 8.32331 15 9.52377 15C13.7317 15 17.1428 11.6421 17.1428 7.5C17.1428 3.35786 13.7317 0 9.52377 0C5.31589 0 1.90473 3.35786 1.90473 7.5C1.90473 8.66493 2.17454 9.76783 2.65599 10.7514L0.682356 13.9085Z" fill="black"/>
      <path d="M9.5238 2.8125V7.8125" stroke="black"/>
      <path d="M9.5238 9.6875L9.5238 12.1875" stroke="black"/>
    </svg>
  </div>
</template>

<script>
  export default {
    props: {
      'buttonType': {
        type: String,
        default: 'primary',
        validator: (value) => {
          return [ 'primary', 'secondary' ].includes(value)
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .floatingButton {
    height: 32px;
    width: 32px;
    border-radius: 36px;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0px 2px 7px rgba(0, 0, 0, 0.15);
    position: fixed;

    &-primary {
      background: $color--background-22;
    }

    &-secondary {
      background: $color--background-white;
      border: 1px solid $color--black;
    }
  }
</style>