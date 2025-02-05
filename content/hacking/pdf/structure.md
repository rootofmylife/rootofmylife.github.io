# PDF Structure

PDF is text-based

A PDF start with a `%PDF-?` signature followed by a version number. For example: `%PDF-1.2`

A comment starts with `%` until the end of the line.

- After the signature, comes the file body

After the file body, comes the cross reference table. It starts with `xref` keyword on separated line.

```bash
%PDF-1.2

%file body

xref
```

After the `xref` keyword, comes the actual table.

```bash
%PDF-1.2

%file body

xref
%xref table
```

After the table, comes the `trailer`... (it starts with the `trailer` keyword)

```bash
%PDF-1.2

%file body

xref
%xref table

trailer
```

... and its contents

```bash
%PDF-1.2

%file body

xref
%xref table

trailer
%trailer contents
```

Then, the pointer to `xref table` (`startxref`)

```bash
%PDF-1.2

%file body

xref
%xref table

trailer
%trailer contents

startxref
```

And then the `xref pointer`

```bash
%PDF-1.2

%file body

xref
%xref table

trailer
%trailer contents

startxref
%xref pointer
```

Lastly, to mark the end of the file

```bash
%PDF-1.2

%file body

xref
%xref table

trailer
%trailer contents

startxref
%xref pointer

%%EOF
```

## Definition

### Name object: string starting with a slash

For example: `/Name`

This is case sensitive, names with incorrect case are just ignored

### Dictionary object

Sequence of keys and values (no delimiter in between)
Enclosed in `<<` and `>>`
Set each key to value

Syntax: `<< key value key value [key value]* >>`

Keys are always **name object**. For example: `<< /Index 1 >>` which means set `/Index` to `1`

==`<< Index 1 >>` is invalid. Because key is not a name ==

Dictionaries can have any length.

```bash
<< /Index 1
/Count /Whatever >>
```

which means set `/Index` to `1`; and `/Count` to `/Whatever`

Dictionaries can be nested

```bash
<< /MyDict << >> >>
```

which means set `/MyDict` to `<< >>`

### Indirect object

An object number (>0), a generation number (0)

- The `obj` keyword
- The object content
- The `endobj` keyword

For example:

```bash
1 0 obj
3
endobj
```

which means object #1, generation 0, containing "3"

### Object reference

Syntax: [object number, object generation, R]
=> number number R

For example:

```bash
1 0 R
```

This refers to an indirect object as value

For example:

```bash
<< /Root 1 0 R >>
```

which means referring to object number 1, generation 0 as the `/Root`

Used only as values in a dictionary

`<< /Root 1 0 R >>` is ok, which means set `/Root` to `1 0 R`
`<< 1 0 R /Catalog >>` is invalid, this means set `1` to `0`, `R` to `/Catalog`

Be careful with the syntax

`1 2 3` is a sequence of 3 numbers: 1, 2, 3

`1 0 R` is a single reference to an object number 1 generation 0

### File body

Sequence of indirect objects. (object order doesn't matter)

For example defining 2 objects with different contents:

```bash
1 0 obj 3 endobj
2 0 obj << /Index 1 >> endobj
```

### Array

Enclosed in `[]`
Values separated by whitespace

For example: `[1 2 3 4]` is an array of 4 integers `1 2 3 4`

### Stream object

This is how you store binary data (image, video)
Stream objects are objects. They start and end like any other object:

For example:

```bash
1 0 obj
...
endobj
```

but between `stream` and `endstream` keywords

```bash
1 0 obj
stream
...
endstream
endobj
```

Stream parameters are stored before the stream. It's a dictionary, and it stays after `obj`, before `stream` keyword
It's required: stream length, compression algorithm, etc

For example:

```bash
1 0 obj
<< /Length 10 >>
stream
0123456679
endstream
endobj
```

### Literal string

Enclosed in parentheses. Can contain white space
Standard escaping is supported (`\r\n`)
Escaping is in octal (`\157`)

For example:

`(this is content which is shown to user)`

## A PDF document is defined by a tree of objects

Back to this:

```bash
%PDF-1.2

%file body

xref
%xref table

trailer
%trailer contents

startxref
%xref pointer

%%EOF
```

We will start with `trailer`

```bash
trailer
%trailer contents
```

The trailer is a dictionary

```bash
trailer
<< >>
```

It defines a `/Root` name that refers to an object the will be in the file body (`%file body`)

```bash
trailer
<< /Root 1 0 R >>
```

=> Trailer is a dictionary that refers to a root object

**Now**, back to our file body (`%file body`), lets create our first object (with the standard object declaration)...

```bash
%PDF-1.2

1 0 obj

0 0 endobj

xref
%xref table

trailer
%trailer contents

startxref
%xref pointer

%%EOF
```

... that contains a dictionary.

```bash
%PDF-1.2

1 0 obj
<< >>
0 0 endobj

xref
```

and its `/Type` is defined as `/Catalog`

```bash
%PDF-1.2

1 0 obj
<< /Type /Catalog >>
0 0 endobj

xref
```

The `/Root` object also refers to the page tree, via `/Pages` name that refers to another object which we'll create.

```bash
%PDF-1.2

1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
0 0 endobj

xref
```

=> Object 1 is a catalog, and refers to a Pages object

Let's create object 2. The pages' object `/Type` has to be defined as `/pages`

```bash
%PDF-1.2

1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
0 0 endobj

2 0 obj
<< /Type /Pages >>
0 0 endobj

xref
```

This object defines its children via `/Kids` which is an array...

```bash
%PDF-1.2

1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
0 0 endobj

2 0 obj
<< /Type /Pages
/Kids [ ]
>>
0 0 endobj

xref
```

... of references to each page object.

```bash
%PDF-1.2

1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
0 0 endobj

2 0 obj
<< /Type /Pages
/Kids [ 3 0 R ]
>>
0 0 endobj

xref
```

And, the number of kids has to set in `/Count`

```bash
%PDF-1.2

1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
0 0 endobj

2 0 obj
<< /Type /Pages
/Kids [ 3 0 R ]
/Count 1 >>
0 0 endobj

xref
```

And now object 2 is complete

=> object 2 is `/Pages`; it defines Kids + Count (pages of the document)

We can add our only Kid (a single page) a dictionary...

```bash
%PDF-1.2

1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
0 0 endobj

2 0 obj
<< /Type /Pages
/Kids [ 3 0 R ]
/Count 1 >>
0 0 endobj

3 0 obj

<< >>
0 0 endobj

xref
```

... defining a `/Type` as `/Page`

```bash
%PDF-1.2

1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
0 0 endobj

2 0 obj
<< /Type /Pages
/Kids [ 3 0 R ]
/Count 1 >>
0 0 endobj

3 0 obj
<< /Type /Page >>
0 0 endobj

xref
```

This kid will recognize its parent, via `/Parent`

```bash
%PDF-1.2

1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
0 0 endobj

2 0 obj
<< /Type /Pages
/Kids [ 3 0 R ]
/Count 1 >>
0 0 endobj

3 0 obj
<< /Type /Page /Parent 2 0 R >>
0 0 endobj

xref
```

Our page requires resources (`/Resources`) as a dictionary

```bash
%PDF-1.2

1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
0 0 endobj

2 0 obj
<< /Type /Pages
/Kids [ 3 0 R ]
/Count 1 >>
0 0 endobj

3 0 obj
<< /Type /Page /Parent 2 0 R
/Resources << >>
>>
0 0 endobj

xref
```

In this case, `/Font` as a dictionary

```bash
%PDF-1.2

1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
0 0 endobj

2 0 obj
<< /Type /Pages
/Kids [ 3 0 R ]
/Count 1 >>
0 0 endobj

3 0 obj
<< /Type /Page /Parent 2 0 R
/Resources << /Font >>
>>
0 0 endobj

xref
```

We define one font by giving it a name

```bash
<< /Font << /F1 >> >>
```

and setting its parameters

```bash
<< /Font << /F1 << >> >> >>
```

Its type is font, and its font type is Type1

```bash
<< /Font << /F1 << /Type /Font /Subtype /Type1 >> >> >>
```

And its name is `/Arial`

```bash
<< /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Arial >> >> >>
```

So, now we add the content as a reference to another object:

```bash
%PDF-1.2

1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
0 0 endobj

2 0 obj
<< /Type /Pages
/Kids [ 3 0 R ]
/Count 1 >>
0 0 endobj

3 0 obj
<< /Type /Page /Parent 2 0 R
/Resources << /Font ... >>

/Contents 4 0 R % <==================================
>>
0 0 endobj

xref
```

That's all for our page object.

=> object 3 defines a `/Page`, its `/Parent`, `/Resource`s (fonts), and its `/Content`s is another object

Let's create content object after you review stream object

```bash
4 0 obj

endobj
```

We create a `/Content` object, that is a stream object

```bash
4 0 obj
stream

endstream
endobj
```

We should know that there is page contents syntax. Its syntax is `parameters sequence then operator`

For example: `param1 param2 operator`

Text objects are delimited by `BT` and `ET` (begin text & end text)

```bash
4 0 obj
stream
BT

ET
endstream
endobj
```

We need to set a font with `Tf`. It takes 2 parameters: a font name (from the page's resources) and a font size

```bash
4 0 obj
stream
/F1 100 Tf
endstream
endobj
```

We move the cursor, with the `Td` operator

```bash
4 0 obj
stream
BT
/F1 100 Tf
Td
ET
endstream
endobj
```

... that takes 2 parameters `x` & `y` coordinates (default page size: 612x792)

```bash
4 0 obj
stream
BT
/F1 100 Tf
10 400 Td $<===============================
ET
endstream
endobj
```

Now, we show a text string is done with the `Tj` operator, that takes a single parameter a literal string.

```bash
4 0 obj
stream
BT
/F1 100 Tf
10 400 Td
(Hello World!) Tj $<===============================
ET
endstream
endobj
```

And, our contents stream is complete

One last thing, we need to set its parameters: the stream length including white space (new lines characters).

```bash
4 0 obj
<< /Length 44 >>
stream
BT %<============== From here
/F1 100 Tf
10 400 Td
(Hello World!) Tj
ET %<============== To here
endstream
endobj
```

Our stream parameters are finished, so our page contents object is finished

=> object 4 is a stream object with a set length, defining the page's contents: declare text, set a font and size, move cursor, display text.

Done. Now we polish the structure

Our PDF defines 4 objects, starting at index 1

```bash
1 0 obj %<========================= object 1
<< /Type /Catalog /Pages 2 0 R >>
0 0 endobj

2 0 obj %<========================= object 2
<< /Type /Pages
/Kids [ 3 0 R ]
/Count 1 >>
0 0 endobj

3 0 obj %<========================= object 3
<< /Type /Page /Parent 2 0 R
/Resources << /Font ... >>

/Contents 4 0 R %
>>
0 0 endobj

4 0 obj %<========================= object 4
<< /Length 44 >>
stream
BT
/F1 100 Tf
10 400 Td
(Hello World!) Tj
ET
endstream
endobj
```

==... but PDFs always have an object `0`, that is null ... So, 5 object, starting at 0==

We have to define offsets, which are affected by the EOL conventions:

- 1 char under Linux/Mac
- 2 under Windows

Let's edit the XREF table

```bash
xref
%xref table
```

The next line defines the starting index

```bash
xref
0
```

... and the number of objects

```bash
xref
0 5
```

Then, one line per object, following the `xxxxxxxxxx yyyyy a` format (10 digits, 5 digits, 1 letter).

The first parameter is the offset (in decimal) of the object (for the null object, it's 0)

```bash
xref
0 5
0000000000 %<==================
```

Then, the generation number (that is almost always 0), but for object 0, it's 65535

```bash
xref
0 5
0000000000 65535 %<==================
```

Then, a letter, to tell if this entry is free (**f**) or in use (**n**)

```bash
xref
0 5
0000000000 65535 f %<==================
```

Lastly, each line should take 20 bytes, including EOL... => so add a trailing space

```bash
xref
0 5
0000000000 65535 f [space] %<==================
```

Next line (the first real object) ....

... object offset, in decimal

```bash
xref
0 5
0000000000 65535 f [space]
0000000010 %<==================
```

... generation number...

```bash
xref
0 5
0000000000 65535 f [space]
0000000010 00000 %<==================
```

... and declare the object index in use (**n**)... with space at the end of the line.

```bash
xref
0 5
0000000000 65535 f [space]
0000000010 00000 n [space] %<==================
```

Do the same with the other objects... knowing that all lines will end with `00000 n`

```bash
xref
0 5
0000000000 65535 f [space]
0000000010 00000 n [space]
0000000060 00000 n [space]
0000000120 00000 n [space]
0000000269 00000 n [space]
```

The cross-reference table is finished

**Now**, we set the `startxref` pointer

```bash
startxref
%xref pointer
```

... as xref's offset, in decimal (no prepending 0s)

```bash
starxref
364
```

We also need to update the trailer dictionary with the number of objects

```bash
trailer
<< /Root 1 0 R /Size >> %<================
```

... in the PDF (including object 0)

```bash
trailer
<< /Root 1 0 R /Size 5 >> %<================
```

Our PDF is now complete. You can open it in software now

You can use `mutool` to fix offsets and lengths

## One more thing

Streams can be encoded and/or compressed
Algorithms can be cascaded
Ex: compression, then ASCII encoding

![PDF Structure](../assets/Pasted%20image%2020240920133552.png)
![PDF Structure](../assets/Pasted%20image%2020240920133626.png)
![PDF Structure](../assets/Pasted%20image%2020240920133645.png)

Anyway, `mutool clean -d` can clean and remove any stream filter
