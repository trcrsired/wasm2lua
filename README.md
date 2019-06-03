# 🎉 wasm2lua 🎊

Have YOU ever wanted to run C++/C/Rust/javascript/banana/etc. on Lua without using native modules?

GOOD NEWS, fam: `wasm2lua` can compile WebAssembly modules to pure Lua (or with FFI LuaJIT for extra speed). This means that anything that can be compiled to WASM can be compiled to Lua! Long Live John Lua!

## Notes

 - The generated code is heavily dependent upon the LuaJIT bit library
 - You will need to manually patch some of `@webassemblyjs`'s libraries (see below for the patches)
 - The WASI API is still under heavy development

# Usage

`wasm2lua <in.wasm> <out.lua>`

`lua-webidl <in.idl> <out.cpp> --cpp`

(Run those commands with `--help` for other options)

### BONUS: duktape via wasm2lua

```c
int main(int argc, char *argv[]) {
	duk_context *ctx = duk_create_heap_default();

	(void) argc; (void) argv;  /* suppress warning */

	duk_push_c_function(ctx, native_print, DUK_VARARGS);
	duk_put_global_string(ctx, "print");
	duk_push_c_function(ctx, native_adder, DUK_VARARGS);
	duk_put_global_string(ctx, "adder");

	duk_eval_string(ctx, "print('Hello world!');");

	duk_eval_string(ctx, "print('2+3=' + adder(2, 3));");
	duk_pop(ctx);  /* pop eval result */

	duk_destroy_heap(ctx);

	return 0;
}

```

![duktape demo](resources/img/duktape.png)