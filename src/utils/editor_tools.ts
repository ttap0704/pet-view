const imageHandler = () => {
  //
};

export const toolbar = {
  container: [
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ size: ['small', false, 'large', 'huge'] }, { color: [] }],
    [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }, { align: [] }],
    ['image', 'video'],
  ],
  handlers: {
    image: imageHandler,
  },
};
