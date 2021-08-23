<template>
    <div>
        <file-pond
            name="filepond"
            class="filepond"
            ref="pond"
            label-idle="<p class='filepond--label-action' style='margin-top: 10px;'>Parcourir</p>"
            allow-file-type-validation=true
            allow-mutiple=false
            instantUpload=false
            accepted-file-types="image/png, image/jpeg, image/jpg, image/gif"
            allowImagePreview=true
            allowReplace=true
            allowImageExifOrientation=true
            checkValidity=true
            maxFiles=1
            imagePreviewHeight="170"
            imageCropAspectRatio="1:1"
            stylePanelLayout="compact circle"
            styleLoadIndicatorPosition="center bottom"
            styleProgressIndicatorPosition="right bottom"
            styleButtonProcessItemPosition="right bottom"
            styleButtonRemoveItemPosition="center bottom"
            v-on:addfile="handleFilePondGet" 
        />
    </div>
</template>

<script>
    // Imports FilePond
    import vueFilePond from 'vue-filepond';
    import 'filepond/dist/filepond.min.css';
    import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
    import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
    import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
    import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
    const FilePond = vueFilePond(
        FilePondPluginFileValidateType, 
        FilePondPluginImagePreview, 
        FilePondPluginImageExifOrientation
        );
    
    export default {
        name: 'AttachmentPreview',
        data() {
            return {
                file: '',
            }
        },
        methods: {
            handleFilePondGet: function() {
                console.log('FilePond est initialisé');
                const getFile = this.$refs.pond.getFile();
                this.file = getFile.file;
                this.$emit('getFile', this.file);
            }
        },
        components: {
            FilePond
        }
    }
</script>

<style scoped>
    
</style>