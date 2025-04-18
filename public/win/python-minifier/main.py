import sys
import os
import argparse
from python_minifier import minify

os.environ["PYTHONIOENCODING"] = "utf-8"


def main(args):
    """
    examples:
      # Minifying source code to stdout
      python minifier.py --code 'print("Hello, world!")'

      # Minifying source code and writing to a file
      python minifier.py --code 'print("Hello, world!")' --output example.min.py

      # Minifying a file to stdout
      python minifier.py --path example.py

      # Minifying a file and writing to a different file
      python minifier.py --path example.py --output example.min.py
    """

    if args.code:
        # minify code
        minified = do_minify(args.code, "code", args)

        if args.output:
            with open(args.output, "w", encoding="utf-8") as f:
                f.write(minified)
        else:
            sys.stdout.buffer.write(minified.encode("utf-8"))

    elif args.path:
        # minify source paths
        for path in source_modules(args):
            if args.output:
                sys.stdout.write(path + "\n")

            with open(path, "r", encoding="utf-8") as f:
                source = f.read()

            minified = do_minify(source, path, args)

            if args.output:
                with open(args.output, "w", encoding="utf-8") as f:
                    f.write(minified)
            else:
                sys.stdout.buffer.write(minified.encode("utf-8"))


def parse_args():
    parser = argparse.ArgumentParser(
        description="Minify Python source code",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=main.__doc__,
    )

    input_options = parser.add_mutually_exclusive_group(required=True)
    input_options.add_argument(
        "--code",
        "-c",
        type=str,
        help="Python code to minify. Outputs to stdout by default",
        dest="code",
    )
    input_options.add_argument(
        "--path",
        "-p",
        nargs="+",
        type=str,
        help='The source file or directory to minify. Use "-" to read from stdin. Directories are recursively searched for ".py" files to minify. May be used multiple times',
        dest="path",
    )

    parser.add_argument(
        "--output",
        "-o",
        type=str,
        help="Path to write minified output. Can only be used when the source is source code or a single module. Outputs to stdout by default",
        dest="output",
    )

    # Minification arguments
    minification_options = parser.add_argument_group(
        "minification options", "Options that affect how the source is minified"
    )
    minification_options.add_argument(
        "--no-combine-imports",
        action="store_false",
        help="Disable combining adjacent import statements",
        dest="combine_imports",
    )
    minification_options.add_argument(
        "--no-remove-pass",
        action="store_false",
        default=True,
        help="Disable removing Pass statements",
        dest="remove_pass",
    )
    minification_options.add_argument(
        "--remove-literal-statements",
        action="store_true",
        help="Enable removing statements that are just a literal (including docstrings)",
        dest="remove_literal_statements",
    )
    minification_options.add_argument(
        "--no-remove-annotations",
        action="store_false",
        help="Disable removing function and variable annotations",
        dest="remove_annotations",
    )
    minification_options.add_argument(
        "--no-hoist-literals",
        action="store_false",
        help="Disable replacing string and bytes literals with variables",
        dest="hoist_literals",
    )
    minification_options.add_argument(
        "--no-rename-locals",
        action="store_false",
        help="Disable shortening of local names",
        dest="rename_locals",
    )
    minification_options.add_argument(
        "--preserve-locals",
        type=str,
        action="append",
        help="Comma separated list of local names that will not be shortened",
        dest="preserve_locals",
        metavar="LOCAL_NAMES",
    )
    minification_options.add_argument(
        "--rename-globals",
        action="store_true",
        help="Enable shortening of global names",
        dest="rename_globals",
    )
    minification_options.add_argument(
        "--preserve-globals",
        type=str,
        action="append",
        help="Comma separated list of global names that will not be shortened",
        dest="preserve_globals",
        metavar="GLOBAL_NAMES",
    )
    minification_options.add_argument(
        "--no-remove-object-base",
        action="store_false",
        help="Disable removing object from base class list",
        dest="remove_object_base",
    )
    minification_options.add_argument(
        "--no-convert-posargs-to-args",
        action="store_false",
        help="Disable converting positional only arguments to normal arguments",
        dest="convert_posargs_to_args",
    )
    minification_options.add_argument(
        "--no-preserve-shebang",
        action="store_false",
        help="Preserve any shebang line from the source",
        dest="preserve_shebang",
    )
    minification_options.add_argument(
        "--remove-asserts",
        action="store_true",
        help="Remove assert statements",
        dest="remove_asserts",
    )
    minification_options.add_argument(
        "--remove-debug",
        action="store_true",
        help="Remove conditional statements that test __debug__ is True",
        dest="remove_debug",
    )
    minification_options.add_argument(
        "--no-remove-explicit-return-none",
        action="store_false",
        help="Replace explicit return None with a bare return",
        dest="remove_explicit_return_none",
    )

    args = parser.parse_args()

    return args


def source_modules(args):

    def error(os_error):
        raise os_error

    for path_arg in args.path:
        if os.path.isdir(path_arg):
            for root, dirs, files in os.walk(path_arg, onerror=error, followlinks=True):
                for file in files:
                    if file.endswith(".py") or file.endswith(".pyw"):
                        yield os.path.join(root, file)
        else:
            yield path_arg


def do_minify(source, filename, minification_args):

    preserve_globals = []
    if minification_args.preserve_globals:
        for arg in minification_args.preserve_globals:
            names = [name.strip() for name in arg.split(",") if name]
            preserve_globals.extend(names)

    preserve_locals = []
    if minification_args.preserve_locals:
        for arg in minification_args.preserve_locals:
            names = [name.strip() for name in arg.split(",") if name]
            preserve_locals.extend(names)

    return minify(
        source,
        filename=filename,
        combine_imports=minification_args.combine_imports,
        remove_pass=minification_args.remove_pass,
        remove_annotations=minification_args.remove_annotations,
        remove_literal_statements=minification_args.remove_literal_statements,
        hoist_literals=minification_args.hoist_literals,
        rename_locals=minification_args.rename_locals,
        preserve_locals=preserve_locals,
        rename_globals=minification_args.rename_globals,
        preserve_globals=preserve_globals,
        remove_object_base=minification_args.remove_object_base,
        convert_posargs_to_args=minification_args.convert_posargs_to_args,
        preserve_shebang=minification_args.preserve_shebang,
        remove_asserts=minification_args.remove_asserts,
        remove_debug=minification_args.remove_debug,
        remove_explicit_return_none=minification_args.remove_explicit_return_none,
    )


if __name__ == "__main__":
    args = parse_args()
    main(args=args)
