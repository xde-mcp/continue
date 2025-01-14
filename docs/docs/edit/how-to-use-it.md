---
title: Edit
sidebar_position: 1
sidebar_label: How to use it
description: How to use Edit
keywords: [edit, cmd l, use]
---

![edit](/img/edit.gif)

## How to use it

Edit can be used in two ways: _Inline_ and _Multifile_.

_Inline Edit_ is a convenient way to modify code without leaving your current file. Highlight a block of code, describe your code changes, and a diff will be streamed inline to your file which you can accept or reject.

Inline Edit is best used for small, quick changes such as:

- Writing comments
- Generating unit tests
- Refactoring functions or methods

_Multifile Edit_ allows you to add multiple files, ranges, or insertion points as context to be edited in a single request. Each codeblock can be applied one at a time, and individual changes can be accepted or rejected.

Multifile Edit is best used for complex changes such as:

- Full-stack features
- Large-scale code refactoring
- Prototyping

## Highlight code and activate

Highlight the block of code you would like to modify, and press <kbd>cmd/ctrl</kbd> + <kbd>i</kbd> to add it to your _Code to Edit_.

To add an entire file as input, press <kbd>cmd/ctrl</kbd> + <kbd>shft</kbd> + <kbd>i</kbd>

## Describe code changes

Describe the changes you would like the model to make to your highlighted code.

For Inline Edit, a good prompt should be relatively short and concise.

For Multifile Edit, a good prompt is more thorough and comprehensive.

## Accept or reject changes

For Inline Edit, proposed changes appear as diffs within your highlighted text.

You can navigate through each proposed change, accepting or rejecting them using <kbd>cmd/ctrl</kbd> + <kbd>opt</kbd> + <kbd>y</kbd> (to accept) or <kbd>cmd/ctrl</kbd> + <kbd>opt</kbd> + <kbd>n</kbd> (to reject).

You can also accept or reject all changes at once using <kbd>cmd/ctrl</kbd> + <kbd>shift</kbd> + <kbd>enter</kbd> (to accept) or <kbd>cmd/ctrl</kbd> + <kbd>shift</kbd> + <kbd>delete/backspace</kbd> (to reject).

If you want to request a new suggestion for the same highlighted code section, you can use <kbd>cmd/ctrl</kbd> + <kbd>i</kbd> to re-prompt the model.

For Multifile Edit, proposed changes are rendered in the sidebar. You can click "Apply" to apply the changes, and the accept/reject for each file is the same as Inline Edit.
