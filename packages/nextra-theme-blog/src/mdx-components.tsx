import Link from 'next/link'
import { Code, Pre, Table, Td, Th, Tr } from 'nextra/components'
import type { UseMDXComponents } from 'nextra/mdx'
import { DEFAULT_COMPONENTS } from 'nextra/mdx'
import type { ComponentProps, ReactElement } from 'react'
import { isValidDate } from './date'
import { Meta } from './components/meta'

function HeadingLink({
  tag: Tag,
  children,
  id,
  className,
  ...props
}: ComponentProps<'h2'> & { tag: `h${2 | 3 | 4 | 5 | 6}` }): ReactElement {
  return (
    <Tag
      className={
        // can be added by footnotes
        className === 'sr-only' ? '_sr-only' : `_not-prose subheading-${Tag}`
      }
      {...props}
    >
      {children}
      {id && (
        <a
          href={`#${id}`}
          id={id}
          className="subheading-anchor"
          aria-label="Permalink for this section"
        />
      )}
    </Tag>
  )
}

const EXTERNAL_HREF_REGEX = /https?:\/\//

export const useMDXComponents: UseMDXComponents = components => ({
  ...DEFAULT_COMPONENTS,
  h2: props => <HeadingLink tag="h2" {...props} />,
  h3: props => <HeadingLink tag="h3" {...props} />,
  h4: props => <HeadingLink tag="h4" {...props} />,
  h5: props => <HeadingLink tag="h5" {...props} />,
  h6: props => <HeadingLink tag="h6" {...props} />,
  a({ children, href = '', ...props }) {
    if (EXTERNAL_HREF_REGEX.test(href)) {
      return (
        <a href={href} target="_blank" rel="noreferrer" {...props}>
          {children}
        </a>
      )
    }
    return (
      // @ts-expect-error Types of property `ref` are incompatible.
      <Link href={href} {...props}>
        {children}
      </Link>
    )
  },
  pre: ({ children, ...props }) => (
    <div className="_not-prose">
      <Pre {...props}>{children}</Pre>
    </div>
  ),
  tr: Tr,
  th: Th,
  td: Td,
  table: props => <Table className="_not-prose" {...props} />,
  code: Code,
  wrapper({ children, frontMatter, title }) {
    if (frontMatter.date && !isValidDate(frontMatter.date)) {
      throw new Error(
        `Invalid date "${frontMatter.date}". Provide date in "YYYY/M/D", "YYYY/M/D H:m", "YYYY-MM-DD", "[YYYY-MM-DD]T[HH:mm]" or "[YYYY-MM-DD]T[HH:mm:ss.SSS]Z" format.`
      )
    }
    const dateObj = frontMatter.date ? new Date(frontMatter.date) : null

    // @ts-expect-error
    const DateFormatter = components?.DateFormatter

    return (
      <>
        <h1>{title}</h1>
        <Meta {...frontMatter}>
          {dateObj && (
            <time dateTime={dateObj.toISOString()}>
              {(DateFormatter && <DateFormatter date={dateObj} />) ||
                dateObj.toLocaleDateString()}
            </time>
          )}
        </Meta>
        {children}
      </>
    )
  },
  ...components
})