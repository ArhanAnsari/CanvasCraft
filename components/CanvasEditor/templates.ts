// components/CanvasEditor/templates.ts
export type Block = {
  id: string
  type:
    | 'hero'
    | 'features'
    | 'gallery'
    | 'cta'
    | 'footer'
    | 'text'
    | 'video'
    | 'form'
  props: any
}

export const Templates = {
  hero: (
    heading = '<strong>Your product</strong>',
    subheading = 'Short value proposition',
    buttonLabel = 'Get started',
    buttonHref = '#'
  ): Block => ({
    id: crypto.randomUUID(),
    type: 'hero',
    props: { heading, subheading, buttonLabel, buttonHref, bg: '', fontSize: 'base' },
  }),

  features: (
    title = 'Features',
    items = [
      { title: 'Fast', desc: 'Instant realtime edits' },
      { title: 'Simple', desc: 'No-code blocks' },
      { title: 'Collaborative', desc: 'See live cursors' },
    ]
  ): Block => ({
    id: crypto.randomUUID(),
    type: 'features',
    props: { title, items, bg: '', fontSize: 'base' },
  }),

  gallery: (title = 'Gallery', images: string[] = []): Block => ({
    id: crypto.randomUUID(),
    type: 'gallery',
    props: { title, images, bg: '', fontSize: 'base' },
  }),

  cta: (
    text = 'Ready to launch?',
    buttonLabel = 'Get started',
    buttonHref = '#'
  ): Block => ({
    id: crypto.randomUUID(),
    type: 'cta',
    props: { text, buttonLabel, buttonHref, bg: '', fontSize: 'base' },
  }),

  footer: (text = '© Your brand'): Block => ({
    id: crypto.randomUUID(),
    type: 'footer',
    props: { text, bg: '', fontSize: 'base' },
  }),

  text: (text = 'Edit me'): Block => ({
    id: crypto.randomUUID(),
    type: 'text',
    props: { text, bg: '', fontSize: 'base' },
  }),

  // 🎬 New Video block
  video: (url = 'https://www.youtube.com/embed/dQw4w9WgXcQ'): Block => ({
    id: crypto.randomUUID(),
    type: 'video',
    props: { url, autoplay: false, controls: true, bg: '', fontSize: 'base' },
  }),

  // 📩 New Form block
  form: (): Block => ({
    id: crypto.randomUUID(),
    type: 'form',
    props: {
      title: 'Contact Us',
      fields: [
        { label: 'Name', type: 'text', placeholder: 'Enter your name' },
        { label: 'Email', type: 'email', placeholder: 'Enter your email' },
        { label: 'Message', type: 'textarea', placeholder: 'Your message...' },
      ],
      buttonLabel: 'Submit',
      bg: '',
      fontSize: 'base',
    },
  }),
}
