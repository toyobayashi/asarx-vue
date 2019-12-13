export default {
  files: {
    folder1: {
      files: {
        subfolder1: {
          files: {
            subfile: {
              size: 1000,
              offset: '0'
            }
          }
        },
        file1: {
          size: 80,
          offset: '1000'
        },
        file2: {
          size: 40,
          offset: '1080'
        },
        file3: {
          size: 233,
          unpacked: true
        }
      }
    },
    folder2: {
      files: {
        file4: {
          size: 20,
          offset: '1120'
        }
      }
    },
    file5: {
      size: 100,
      offset: '1140'
    }
  }
}
