# LupBook usage reference

### 1. LupBook Activity Types:

LupBook currently supports the following interactive activity types:

- **Interactive Code (ICode):** Allows students to write and run code directly within the textbook.
- **Multiple Choice Questions (MCQ):** Presents students with a question and a list of answer choices.
- **Fill-in-the-Blanks (FIB):**  Requires students to fill in missing words or phrases in a text.
- **Parsons Problems:**  Challenges students to arrange code fragments into the correct order.
- **Horizontal Parsons Problems:** Similar to Parsons Problems but with a horizontal layout.

### 2. Defining Activities in Markdown:

To embed an interactive activity in your Markdown textbook, use the following syntax:

````markdown
``` <activity_type>
<YAML Configuration>
```
````

- **`<activity_type>`:** Replace with the specific activity type (e.g., `icode`, `mcq`, `fib`, `parsons`, `hparsons`).
- **`<YAML Configuration>`:**  Provide the activity's configuration in YAML format (explained in detail below).

**Example (MCQ):**

````markdown
``` mcq
id: capitals-quiz
title: Capitals of Europe
prompt: What is the capital of Italy?
choices:
  - text: Paris
    feedback: That's the capital of France!
  - text: Rome
    feedback: Correct!
    correct: true
  - text: Madrid
    feedback: That's the capital of Spain!
```
````

### 3. YAML Configuration:

Each activity type has specific YAML configuration options. Here's a breakdown:

#### 3.1 Interactive Code (ICode):

```yaml
id: <unique_id>
title: <activity_title>
prompt: <instructions_for_students>
skeleton:
  - filename: <filename>
    data: <initial_code>
    readonly: <true/false or list of line ranges>
    hidden: <true/false>
tests:
  - name: <test_name>
    precmds: <list_of_commands_to_run_before_the_test>
    cmds: <list_of_commands_to_execute>
    postcmds: <list_of_commands_to_run_after_the_test>
    fatal: <true/false (stop testing if this test fails)>
    checks:
      - output: <stdout/stderr/file>
        filename: <filename (if output is file)>
        type: <exact/regex>
        content: <expected_output>
```

- **`id`:** Unique identifier for the activity (required).
- **`title`:** Title displayed to the student (required).
- **`prompt`:** Instructions or context for the activity (required).
- **`skeleton`:**  Defines the initial code files.
    - **`filename`:** Name of the file.
    - **`data`:** The initial code content.
    - **`readonly`:** Can be `true` to make the entire file read-only, or a list of line ranges to make specific sections read-only (e.g., `[1, 5]`, `[{from: 10, to: 20}]`).
    - **`hidden`:**  If `true`, the file is not shown to the student.
- **`tests`:** A list of test cases to run.
    - **`name`:** Descriptive name of the test.
    - **`precmds`, `cmds`, `postcmds`:** Lists of commands to execute before, during, and after the test.
    - **`fatal`:** If `true`, the entire activity stops if this test fails.
    - **`checks`:**  A list of checks to perform on the output of the test commands.
        - **`output`:**  Specifies where to check the output (`stdout`, `stderr`, or `file`).
        - **`filename`:** The file to check (if `output` is `file`).
        - **`type`:** The type of check (`exact` for exact string matching or `regex` for regular expression matching).
        - **`content`:** The expected output string or regular expression.

#### 3.2 Multiple Choice Questions (MCQ):

```yaml
id: <unique_id>
title: <activity_title>
prompt: <question_text>
many: <true/false (allow multiple correct answers)>
random: <true/false (randomize choice order)>
choices:
  - text: <answer_choice_text>
    feedback: <feedback_for_this_choice>
    correct: <true/false>
```

- **`id`:** Unique identifier (required).
- **`title`:** Activity title (required).
- **`prompt`:** The question text (required).
- **`many`:** If `true`, allows selecting multiple correct answers.
- **`random`:** If `true`, randomizes the order of choices.
- **`choices`:** A list of answer choices.
    - **`text`:**  The answer choice text.
    - **`feedback`:**  Feedback displayed when this choice is selected.
    - **`correct`:**  Set to `true` if this choice is correct.

#### 3.3 Fill-in-the-Blanks (FIB):

```yaml
id: <unique_id>
title: <activity_title>
prompt: <instructions_for_students>
text: <text_with_|blank|_placeholders>
casing: <true/false (case-sensitive answers)>
blanks:
  - answer: <correct_answer>
    type: <text/number>
    feedback: <feedback_for_this_blank>
```

- **`id`:** Unique identifier (required).
- **`title`:** Activity title (required).
- **`prompt`:** Instructions for the activity (required).
- **`text`:**  The text containing `|blank|` placeholders where students should fill in the blanks.
- **`casing`:** If `true`, answers are case-sensitive.
- **`blanks`:** A list of blank definitions.
    - **`answer`:** The correct answer.
    - **`type`:** The type of answer (`text` or `number`).
    - **`feedback`:** Feedback displayed for this blank.

#### 3.4 Parsons Problems:

```yaml
id: <unique_id>
title: <activity_title>
prompt: <instructions_for_students>
random: <true/false (randomize fragment order)>
label: <true/false (display numbered labels)>
frags:
  - id: <fragment_id (integer)>
    depend: <dependency_id (optional)>
    gid: <group_id (optional)>
    text: <code_fragment_text>
```

- **`id`:**  Unique identifier (required).
- **`title`:**  Activity title (required).
- **`prompt`:**  Instructions for the activity (required).
- **`random`:** If `true`, randomizes the order of code fragments.
- **`label`:** If `true`, displays numbered labels next to each fragment.
- **`frags`:** A list of code fragments.
    - **`id`:** Unique integer ID for the fragment.
    - **`depend`:**  Optional ID of another fragment that this fragment depends on (must be placed after the dependency).
    - **`gid`:**  Optional group ID to create OR-groups (fragments with the same `gid` are considered part of an OR-group, and only one needs to be placed correctly).
    - **`text`:** The code fragment text.

#### 3.5 Horizontal Parsons Problems:

- The configuration is the same as regular Parsons Problems, but the activity type keyword is `hparsons`.
